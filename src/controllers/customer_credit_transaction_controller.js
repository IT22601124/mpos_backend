const { CustomerCreditTransaction, Customer } = require('../../models');
const { createCrudController } = require('./crud_controller_factory');

const controller = createCrudController(CustomerCreditTransaction, {
  singular: 'customer_credit_transaction',
  plural: 'customer_credit_transactions',
  include: () => [
    { model: Customer, as: 'customer' }
  ]
});

exports.createCustomerCreditTransaction = controller.create;
exports.getAllCustomerCreditTransactions = controller.list;
exports.getCustomerCreditTransactionById = controller.getById;
exports.updateCustomerCreditTransaction = controller.update;
exports.deleteCustomerCreditTransaction = controller.remove;
