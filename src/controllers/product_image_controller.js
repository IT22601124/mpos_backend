import { createRequire } from 'module';
import { createCrudController } from './crud_controller_factory.js';

const require = createRequire(import.meta.url);
const { ProductImage, Product } = require('../../models/index.js');

const controller = createCrudController(ProductImage, {
  singular: 'product_image',
  plural: 'product_images',
  include: () => [
    { model: Product, as: 'product' }
  ]
});

export const createProductImage = controller.create;
export const getAllProductImages = controller.list;
export const getProductImageById = controller.getById;
export const updateProductImage = controller.update;
export const deleteProductImage = controller.remove;
