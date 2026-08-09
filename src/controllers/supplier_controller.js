import { createRequire } from 'module';
import { createCrudController } from './crud_controller_factory.js';

const require = createRequire(import.meta.url);
const { Supplier } = require('../../models/index.js');

const controller = createCrudController(Supplier, {
  singular: 'supplier',
  plural: 'suppliers'
});

export const createSupplier = controller.create;
export const getAllSuppliers = controller.list;
export const getSupplierById = controller.getById;
export const updateSupplier = controller.update;
export const deleteSupplier = controller.remove;
