import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { BackendUser, Role, Branch } = require('../../models/index.js');

export const createBackendUser = async (req, res) => {
  try {
    let { name, email, phone, password, role_id, branch_id, role, branch, designation, department, salary, shift, emergency_contact, arrival_time, leave_time, salary_paid } = req.body;
    
    // Resolve role_id if missing or passed as role name string
    if (role_id === undefined || role_id === null) {
      if (role) {
        const foundRole = await Role.findOne({ where: { name: role } });
        if (foundRole) role_id = foundRole.id;
      }
      if (!role_id) role_id = 2; // Default to role_id 2 (Cashier/Member)
    }

    // Resolve branch_id if missing or passed as branch name string
    if (branch_id === undefined || branch_id === null) {
      if (branch) {
        const foundBranch = await Branch.findOne({ where: { name: branch } });
        if (foundBranch) branch_id = foundBranch.id;
      }
      if (!branch_id) branch_id = 1; // Default to branch_id 1
    }

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const userPassword = password || '123456';

    const newUser = await BackendUser.create({
      name,
      email: email || `${phone.replace(/\s+/g, '')}@company.com`,
      phone,
      password: userPassword,
      role_id: Number(role_id),
      branch_id: Number(branch_id),
      designation,
      department,
      salary,
      shift,
      emergency_contact,
      arrival_time,
      leave_time,
      salary_paid: salary_paid ?? false,
    });

    const userWithAssociations = await BackendUser.findByPk(newUser.id, {
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['name'],
        },
      ],
    });

    const userJson = (userWithAssociations || newUser).toJSON();
    delete userJson.password;

    res.status(201).json(userJson);
  } catch (error) {
    console.error('Error creating backend user:', error);
    res.status(500).json({
      error: error.message || 'Error creating user',
    });
  }
};

export const loginBackendUser = async (req, res) => {
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

export const getAllBackendUsers = async (req, res) => {
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

export const verifyToken = async (req, res) => {
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

export const updateBackendUser = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, email, phone, role_id, branch_id, role, branch, status, designation, department, salary, shift, emergency_contact, arrival_time, leave_time, salary_paid } = req.body;
    
    const user = await BackendUser.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (role_id === undefined || role_id === null) {
      if (role) {
        const foundRole = await Role.findOne({ where: { name: role } });
        if (foundRole) role_id = foundRole.id;
      }
    }

    if (branch_id === undefined || branch_id === null) {
      if (branch) {
        const foundBranch = await Branch.findOne({ where: { name: branch } });
        if (foundBranch) branch_id = foundBranch.id;
      }
    }

    await user.update({
      ...(name ? { name } : {}),
      ...(email !== undefined ? { email } : {}),
      ...(phone ? { phone } : {}),
      ...(role_id !== undefined ? { role_id: Number(role_id) } : {}),
      ...(branch_id !== undefined ? { branch_id: Number(branch_id) } : {}),
      ...(status ? { status: status.toLowerCase() } : {}),
      ...(designation !== undefined ? { designation } : {}),
      ...(department !== undefined ? { department } : {}),
      ...(salary !== undefined ? { salary } : {}),
      ...(shift !== undefined ? { shift } : {}),
      ...(emergency_contact !== undefined ? { emergency_contact } : {}),
      ...(arrival_time !== undefined ? { arrival_time } : {}),
      ...(leave_time !== undefined ? { leave_time } : {}),
      ...(salary_paid !== undefined ? { salary_paid } : {}),
    });

    const userWithAssociations = await BackendUser.findByPk(user.id, {
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['name'],
        },
      ],
    });

    res.json(userWithAssociations || user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logoutBackendUser = async (req, res) => {
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


