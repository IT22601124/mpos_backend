import { createRequire } from 'module';
import { createCrudController } from './crud_controller_factory.js';

const require = createRequire(import.meta.url);
const { Discount } = require('../../models/index.js');

const controller = createCrudController(Discount, {
  singular: 'discount',
  plural: 'discounts'
});

export const createDiscount = controller.create;
export const getAllDiscounts = controller.list;
export const getDiscountById = controller.getById;
export const updateDiscount = controller.update;
export const deleteDiscount = controller.remove;
