import { createRequire } from 'module';
import { createCrudController } from './crud_controller_factory.js';

const require = createRequire(import.meta.url);
const { Tax } = require('../../models/index.js');

const controller = createCrudController(Tax, {
  singular: 'tax',
  plural: 'taxes'
});

export const createTax = controller.create;
export const getAllTaxes = controller.list;
export const getTaxById = controller.getById;
export const updateTax = controller.update;
export const deleteTax = controller.remove;
