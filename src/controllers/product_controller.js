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

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      created_by: req.body.created_by || (req.user ? req.user.id : null)
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    await product.update(req.body);

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
