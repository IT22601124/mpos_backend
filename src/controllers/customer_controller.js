const { Customer, CustomerCreditTransaction } = require('../../models');
const { createCrudController } = require('./crud_controller_factory');

const controller = createCrudController(Customer, {
  singular: 'customer',
  plural: 'customers',
  include: () => [
    { model: CustomerCreditTransaction, as: 'credit_transactions' }
  ]
});

exports.createCustomer = controller.create;
exports.getAllCustomers = controller.list;
exports.getCustomerById = controller.getById;
exports.updateCustomer = controller.update;
exports.deleteCustomer = controller.remove;
