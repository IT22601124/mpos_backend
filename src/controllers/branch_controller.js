import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Branch } = require('../../models/index.js');

export const createBranch = async (req, res) => {
  try {
    const { name } = req.body;

    const branch = await Branch.create({ name });

    res.status(201).json({
      success: true,
      branch
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBranches = async (_req, res) => {
  try {
    const branches = await Branch.findAll({
      order: [['id', 'ASC']]
    });

    res.json({
      success: true,
      branches
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id);

    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    res.json({
      success: true,
      branch
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id);

    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    await branch.update({
      name: req.body.name
    });

    res.json({
      success: true,
      branch
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.id);

    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }

    await branch.destroy();

    res.json({
      success: true,
      message: 'Branch deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
