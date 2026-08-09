import { createRequire } from 'module';
import { createCrudController } from './crud_controller_factory.js';

const require = createRequire(import.meta.url);
const { ProductVariant, Product } = require('../../models/index.js');

const controller = createCrudController(ProductVariant, {
  singular: 'product_variant',
  plural: 'product_variants',
  include: () => [
    { model: Product, as: 'product' }
  ]
});

export const createProductVariant = controller.create;
export const getAllProductVariants = controller.list;
export const getProductVariantById = controller.getById;
export const updateProductVariant = controller.update;
export const deleteProductVariant = controller.remove;
