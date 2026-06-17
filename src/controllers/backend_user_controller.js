const { BackendUser } = require('../../models');

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
    const user = await BackendUser.findOne({ where: { phone } });

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
    res.json({ access_token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


