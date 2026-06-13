const db = require('../../models');
const BackendUser = db.BackendUser;

exports.createBackendUser = async (req, res) => {
  try {
    const { name, email, phone, password, role_id, branch_id } = req.body;

    const newUser = await BackendUser.create({
      name,
      email,
      phone,
      password,
      role_id,
      branch_id
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating backend user:', error);
    res.status(500).json({
      error: error.message
    });
  }
};