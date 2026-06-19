const { ProductImage, Product } = require('../../models');
const { createCrudController } = require('./crud_controller_factory');

const controller = createCrudController(ProductImage, {
  singular: 'product_image',
  plural: 'product_images',
  include: () => [
    { model: Product, as: 'product' }
  ]
});

exports.createProductImage = controller.create;
exports.getAllProductImages = controller.list;
exports.getProductImageById = controller.getById;
exports.updateProductImage = controller.update;
exports.deleteProductImage = controller.remove;
