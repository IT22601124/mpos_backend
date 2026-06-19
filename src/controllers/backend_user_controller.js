const { BackendUser, Role } = require('../../models');

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
    res.status(500).json({
      error: error.message
    });
  }
};

exports.loginBackendUser = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await BackendUser.findOne({
      where: { phone },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['name']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    const token = await user.generateAccessToken();
    await BackendUser.update(
  { access_token: token },
  { where: { id: user.id } }
);
    res.json({ access_token: token ,user :{
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role_id: user.role_id,
      role_name: user.role ? user.role.name : null,
      branch_id: user.branch_id
    }});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.getAllBackendUsers = async (req, res) => {
  try {
    const users = await BackendUser.findAll({
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['name']
        }
      ]
    });
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role_id: user.role_id,
      role_name: user.role ? user.role.name : null,
      branch_id: user.branch_id
    }));
    res.json({ success: true, users: formattedUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = await BackendUser.findOne({ where: { access_token: token } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.json({ success: true, user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role_id: user.role_id,
      branch_id: user.branch_id
    } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


