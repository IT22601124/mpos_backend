const { Role } = require('../../models');

exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;

    const role = await Role.create({ name });

    res.status(201).json({
      success: true,
      role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllRoles = async (_req, res) => {
  try {
    const roles = await Role.findAll({
      order: [['id', 'ASC']]
    });

    res.json({
      success: true,
      roles
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.json({
      success: true,
      role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    await role.update({
      name: req.body.name
    });

    res.json({
      success: true,
      role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    await role.destroy();

    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
