import { createRequire } from 'module';
import { createCrudController } from './crud_controller_factory.js';

const require = createRequire(import.meta.url);
const { Unit } = require('../../models/index.js');

const controller = createCrudController(Unit, {
  singular: 'unit',
  plural: 'units'
});

export const createUnit = controller.create;
export const getAllUnits = controller.list;
export const getUnitById = controller.getById;
export const updateUnit = controller.update;
export const deleteUnit = controller.remove;
