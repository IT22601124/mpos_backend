import { createRequire } from 'module';
import { createCrudController } from './crud_controller_factory.js';

const require = createRequire(import.meta.url);
const { Customer, CustomerCreditTransaction } = require('../../models/index.js');

const controller = createCrudController(Customer, {
  singular: 'customer',
  plural: 'customers',
  include: () => [
    { model: CustomerCreditTransaction, as: 'credit_transactions' }
  ]
});

export const createCustomer = controller.create;
export const getAllCustomers = controller.list;
export const getCustomerById = controller.getById;
export const updateCustomer = controller.update;
export const deleteCustomer = controller.remove;
