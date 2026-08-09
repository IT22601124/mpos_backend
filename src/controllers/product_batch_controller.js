import { createRequire } from 'module';
import { createCrudController } from './crud_controller_factory.js';

const require = createRequire(import.meta.url);
const { ProductBatch, Product } = require('../../models/index.js');

const controller = createCrudController(ProductBatch, {
  singular: 'product_batch',
  plural: 'product_batches',
  include: () => [
    { model: Product, as: 'product' }
  ]
});

export const createProductBatch = controller.create;
export const getAllProductBatches = controller.list;
export const getProductBatchById = controller.getById;
export const updateProductBatch = controller.update;
export const deleteProductBatch = controller.remove;
