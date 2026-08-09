import { createRequire } from 'module';
import { createCrudController } from './crud_controller_factory.js';

const require = createRequire(import.meta.url);
const { Category } = require('../../models/index.js');

const controller = createCrudController(Category, {
  singular: 'category',
  plural: 'categories'
});

export const createCategory = controller.create;
export const getAllCategories = controller.list;
export const getCategoryById = controller.getById;
export const updateCategory = controller.update;
export const deleteCategory = controller.remove;
