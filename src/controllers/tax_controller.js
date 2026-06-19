const { Tax } = require('../../models');
const { createCrudController } = require('./crud_controller_factory');

const controller = createCrudController(Tax, {
  singular: 'tax',
  plural: 'taxes'
});

exports.createTax = controller.create;
exports.getAllTaxes = controller.list;
exports.getTaxById = controller.getById;
exports.updateTax = controller.update;
exports.deleteTax = controller.remove;
