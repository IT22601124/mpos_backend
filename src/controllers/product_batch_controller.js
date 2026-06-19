const { ProductBatch, Product } = require('../../models');
const { createCrudController } = require('./crud_controller_factory');

const controller = createCrudController(ProductBatch, {
  singular: 'product_batch',
  plural: 'product_batches',
  include: () => [
    { model: Product, as: 'product' }
  ]
});

exports.createProductBatch = controller.create;
exports.getAllProductBatches = controller.list;
exports.getProductBatchById = controller.getById;
exports.updateProductBatch = controller.update;
exports.deleteProductBatch = controller.remove;
