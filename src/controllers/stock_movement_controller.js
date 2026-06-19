const { StockMovement, Product, BackendUser } = require('../../models');
const { createCrudController } = require('./crud_controller_factory');

const controller = createCrudController(StockMovement, {
  singular: 'stock_movement',
  plural: 'stock_movements',
  include: () => [
    { model: Product, as: 'product' },
    { model: BackendUser, as: 'creator', attributes: ['id', 'name', 'email', 'phone'] }
  ],
  buildCreateBody: (body, req) => ({
    ...body,
    created_by: body.created_by || (req.user ? req.user.id : null)
  })
});

exports.createStockMovement = controller.create;
exports.getAllStockMovements = controller.list;
exports.getStockMovementById = controller.getById;
exports.updateStockMovement = controller.update;
exports.deleteStockMovement = controller.remove;
