import { createRequire } from 'module';
import { createCrudController } from './crud_controller_factory.js';

const require = createRequire(import.meta.url);
const { StockMovement, Product, BackendUser } = require('../../models/index.js');

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

export const createStockMovement = controller.create;
export const getAllStockMovements = controller.list;
export const getStockMovementById = controller.getById;
export const updateStockMovement = controller.update;
export const deleteStockMovement = controller.remove;
