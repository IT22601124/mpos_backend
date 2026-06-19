const { Brand } = require('../../models');
const { createCrudController } = require('./crud_controller_factory');

const controller = createCrudController(Brand, {
  singular: 'brand',
  plural: 'brands'
});

exports.createBrand = controller.create;
exports.getAllBrands = controller.list;
exports.getBrandById = controller.getById;
exports.updateBrand = controller.update;
exports.deleteBrand = controller.remove;
