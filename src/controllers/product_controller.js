const {
  Product,
  Category,
  Brand,
  Unit,
  Supplier,
  ProductSupplier,
  ProductBatch,
  ProductImage,
  ProductVariant,
  BackendUser
} = require('../../models');

const productInclude = () => [
  { model: Category, as: 'category' },
  { model: Brand, as: 'brand' },
  { model: Unit, as: 'unit' },
  { model: BackendUser, as: 'creator', attributes: ['id', 'name', 'email', 'phone'] },
  {
    model: Supplier,
    as: 'suppliers',
    through: {
      attributes: ['id', 'supplier_price', 'created_at']
    }
  },
  { model: ProductBatch, as: 'batches' },
  { model: ProductImage, as: 'images' },
  { model: ProductVariant, as: 'variants' }
];

const nullableForeignKeys = {
  category_id: { model: Category, label: 'Category' },
  brand_id: { model: Brand, label: 'Brand' },
  unit_id: { model: Unit, label: 'Unit' }
};

const emptyToNull = (value) => {
  if (value === undefined || value === '') {
    return null;
  }

  return value;
};

const normalizeProductPayload = (body) => {
  const payload = { ...body };

  Object.keys(nullableForeignKeys).forEach((key) => {
    payload[key] = emptyToNull(payload[key]);
  });

  return payload;
};

const validateProductRelations = async (payload) => {
  for (const [key, relation] of Object.entries(nullableForeignKeys)) {
    const value = payload[key];

    if (value === null || value === undefined) {
      continue;
    }

    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
      return `${relation.label} ID must be a valid positive number`;
    }

    const exists = await relation.model.findByPk(id, { attributes: ['id'] });

    if (!exists) {
      return `${relation.label} not found for id ${id}`;
    }

    payload[key] = id;
  }

  return null;
};

const productErrorResponse = (res, error) => {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      error: 'Product code or barcode already exists'
    });
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid category, brand, unit, or creator reference'
    });
  }

  return res.status(500).json({
    success: false,
    error: error.message
  });
};

exports.createProduct = async (req, res) => {
  try {
    const payload = normalizeProductPayload(req.body);
    const relationError = await validateProductRelations(payload);

    if (relationError) {
      return res.status(400).json({
        success: false,
        error: relationError
      });
    }

    const product = await Product.create({
      ...payload,
      created_by: req.body.created_by || (req.user ? req.user.id : null)
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    productErrorResponse(res, error);
  }
};

exports.getAllProducts = async (_req, res) => {
  try {
    const products = await Product.findAll({
      include: productInclude(),
      order: [['id', 'ASC']]
    });

    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: productInclude()
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const payload = normalizeProductPayload(req.body);
    const relationError = await validateProductRelations(payload);

    if (relationError) {
      return res.status(400).json({
        success: false,
        error: relationError
      });
    }

    await product.update(payload);

    res.json({
      success: true,
      product
    });
  } catch (error) {
    productErrorResponse(res, error);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addSupplierToProduct = async (req, res) => {
  try {
    const productSupplier = await ProductSupplier.create({
      product_id: req.params.productId,
      supplier_id: req.body.supplier_id,
      supplier_price: req.body.supplier_price
    });

    res.status(201).json({
      success: true,
      product_supplier: productSupplier
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
