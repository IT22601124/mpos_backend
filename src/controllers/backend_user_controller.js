const { BackendUser, Role } = require('../../models');

exports.createBackendUser = async (req, res) => {
  try {
    const { name, email, phone, password, role_id, branch_id, designation, department, salary, shift, emergency_contact, arrival_time, leave_time, salary_paid } = req.body;
    
    // Check if required parameters are missing to trigger validation error manually if database doesn't catch it
    if (!name || !email || !password || role_id === undefined || branch_id === undefined) {
      return res.status(500).json({ error: 'Validation error' });
    }

    const newUser = await BackendUser.create({
      name,
      email,
      phone,
      password,
      role_id,
      branch_id,
      designation,
      department,
      salary,
      shift,
      emergency_contact,
      arrival_time,
      leave_time,
      salary_paid
    });

    const userJson = newUser.toJSON();
    delete userJson.password;

    res.status(201).json(userJson);
  } catch (error) {
    let errorMsg = error.message;
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      errorMsg = 'Validation error';
    }
    res.status(500).json({
      error: errorMsg
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
      branch_id: user.branch_id,
      designation: user.designation,
      department: user.department,
      salary: user.salary,
      shift: user.shift,
      emergency_contact: user.emergency_contact,
      arrival_time: user.arrival_time,
      leave_time: user.leave_time,
      salary_paid: user.salary_paid
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

exports.updateBackendUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role_id, branch_id, status, designation, department, salary, shift, emergency_contact, arrival_time, leave_time, salary_paid } = req.body;
    
    const user = await BackendUser.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      name,
      email,
      phone,
      role_id,
      branch_id,
      status: status ? status.toLowerCase() : user.status,
      designation,
      department,
      salary,
      shift,
      emergency_contact,
      arrival_time,
      leave_time,
      salary_paid
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logoutBackendUser = async (req, res) => {
  try {
    const userId = req.user.id;
    await BackendUser.update(
      { access_token: null },
      { where: { id: userId } }
    );
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


