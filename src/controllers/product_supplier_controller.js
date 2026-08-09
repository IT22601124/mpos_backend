import { createRequire } from 'module';
import { createCrudController } from './crud_controller_factory.js';

const require = createRequire(import.meta.url);
const { ProductSupplier, Product, Supplier } = require('../../models/index.js');

const controller = createCrudController(ProductSupplier, {
  singular: 'product_supplier',
  plural: 'product_suppliers',
  include: () => [
    { model: Product, as: 'product' },
    { model: Supplier, as: 'supplier' }
  ]
});

export const createProductSupplier = controller.create;
export const getAllProductSuppliers = controller.list;
export const getProductSupplierById = controller.getById;
export const updateProductSupplier = controller.update;
export const deleteProductSupplier = controller.remove;
