const { Category } = require('../../models');
const { createCrudController } = require('./crud_controller_factory');

const controller = createCrudController(Category, {
  singular: 'category',
  plural: 'categories'
});

exports.createCategory = controller.create;
exports.getAllCategories = controller.list;
exports.getCategoryById = controller.getById;
exports.updateCategory = controller.update;
exports.deleteCategory = controller.remove;
