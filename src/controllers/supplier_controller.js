const { Supplier } = require('../../models');
const { createCrudController } = require('./crud_controller_factory');

const controller = createCrudController(Supplier, {
  singular: 'supplier',
  plural: 'suppliers'
});

exports.createSupplier = controller.create;
exports.getAllSuppliers = controller.list;
exports.getSupplierById = controller.getById;
exports.updateSupplier = controller.update;
exports.deleteSupplier = controller.remove;
