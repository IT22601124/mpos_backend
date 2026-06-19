const { Unit } = require('../../models');
const { createCrudController } = require('./crud_controller_factory');

const controller = createCrudController(Unit, {
  singular: 'unit',
  plural: 'units'
});

exports.createUnit = controller.create;
exports.getAllUnits = controller.list;
exports.getUnitById = controller.getById;
exports.updateUnit = controller.update;
exports.deleteUnit = controller.remove;
