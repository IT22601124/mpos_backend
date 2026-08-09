import { createRequire } from 'module';
import { createCrudController } from './crud_controller_factory.js';

const require = createRequire(import.meta.url);
const { Brand } = require('../../models/index.js');

const controller = createCrudController(Brand, {
  singular: 'brand',
  plural: 'brands'
});

export const createBrand = controller.create;
export const getAllBrands = controller.list;
export const getBrandById = controller.getById;
export const updateBrand = controller.update;
export const deleteBrand = controller.remove;
