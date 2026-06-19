const { Discount } = require('../../models');
const { createCrudController } = require('./crud_controller_factory');

const controller = createCrudController(Discount, {
  singular: 'discount',
  plural: 'discounts'
});

exports.createDiscount = controller.create;
exports.getAllDiscounts = controller.list;
exports.getDiscountById = controller.getById;
exports.updateDiscount = controller.update;
exports.deleteDiscount = controller.remove;
