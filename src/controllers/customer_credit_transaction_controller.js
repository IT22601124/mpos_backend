import { createRequire } from 'module';
import { createCrudController } from './crud_controller_factory.js';

const require = createRequire(import.meta.url);
const { CustomerCreditTransaction, Customer } = require('../../models/index.js');

const controller = createCrudController(CustomerCreditTransaction, {
  singular: 'customer_credit_transaction',
  plural: 'customer_credit_transactions',
  include: () => [
    { model: Customer, as: 'customer' }
  ]
});

export const createCustomerCreditTransaction = controller.create;
export const getAllCustomerCreditTransactions = controller.list;
export const getCustomerCreditTransactionById = controller.getById;
export const updateCustomerCreditTransaction = controller.update;
export const deleteCustomerCreditTransaction = controller.remove;
