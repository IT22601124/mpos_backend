const { ProductSupplier, Product, Supplier } = require('../../models');
const { createCrudController } = require('./crud_controller_factory');

const controller = createCrudController(ProductSupplier, {
  singular: 'product_supplier',
  plural: 'product_suppliers',
  include: () => [
    { model: Product, as: 'product' },
    { model: Supplier, as: 'supplier' }
  ]
});

exports.createProductSupplier = controller.create;
exports.getAllProductSuppliers = controller.list;
exports.getProductSupplierById = controller.getById;
exports.updateProductSupplier = controller.update;
exports.deleteProductSupplier = controller.remove;
