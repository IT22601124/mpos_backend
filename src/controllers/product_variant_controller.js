const { ProductVariant, Product } = require('../../models');
const { createCrudController } = require('./crud_controller_factory');

const controller = createCrudController(ProductVariant, {
  singular: 'product_variant',
  plural: 'product_variants',
  include: () => [
    { model: Product, as: 'product' }
  ]
});

exports.createProductVariant = controller.create;
exports.getAllProductVariants = controller.list;
exports.getProductVariantById = controller.getById;
exports.updateProductVariant = controller.update;
exports.deleteProductVariant = controller.remove;
