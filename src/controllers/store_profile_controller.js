const { StoreProfile, BackendUser } = require('../../models');

const includeUsers = () => [
  { model: BackendUser, as: 'creator', attributes: ['id', 'name', 'email', 'phone'] },
  { model: BackendUser, as: 'updater', attributes: ['id', 'name', 'email', 'phone'] }
];

const buildPublicUrl = (req, value) => {
  if (!value) {
    return null;
  }

  if (/^https?:\/\//i.test(value) || /^data:image\//i.test(value)) {
    return value;
  }

  const normalizedPath = value.startsWith('/') ? value : `/${value}`;

  return `${req.protocol}://${req.get('host')}${normalizedPath}`;
};

const serializeProfile = (req, profile) => {
  if (!profile) {
    return null;
  }

  const data = profile.toJSON ? profile.toJSON() : profile;

  return {
    ...data,
    logo_url: buildPublicUrl(req, data.logo)
  };
};

const editableFields = [
  'store_name',
  'legal_name',
  'address_line1',
  'address_line2',
  'city',
  'phone',
  'email',
  'tax_number',
  'currency_code',
  'receipt_footer',
  'status'
];

const normalizeEmpty = (value) => {
  if (value === undefined || value === '') {
    return null;
  }

  return value;
};

const buildPayload = (body) => {
  const payload = {};

  editableFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = normalizeEmpty(body[field]);
    }
  });

  if (payload.currency_code) {
    payload.currency_code = String(payload.currency_code).trim().toUpperCase();
  }

  if (payload.store_name) {
    payload.store_name = String(payload.store_name).trim();
  }

  if (typeof body.logo === 'string' && body.logo.trim()) {
    payload.logo = body.logo.trim();
  }

  return payload;
};

const validatePayload = (payload, isCreate = false) => {
  if (isCreate && !payload.store_name) {
    return 'Store name is required';
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'store_name') && !payload.store_name) {
    return 'Store name is required';
  }

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return 'Email must be valid';
  }

  if (payload.currency_code && payload.currency_code.length > 10) {
    return 'Currency code must be 10 characters or less';
  }

  return null;
};

const getCurrentStoreProfile = async () => {
  const profile = await StoreProfile.findOne({
    include: includeUsers(),
    order: [['id', 'ASC']]
  });

  return profile;
};

exports.getStoreProfile = async (_req, res) => {
  try {
    const profile = await getCurrentStoreProfile();

    res.json({
      success: true,
      store_profile: serializeProfile(_req, profile)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.saveStoreProfile = async (req, res) => {
  try {
    const payload = buildPayload(req.body);
    const existing = await StoreProfile.findOne({ order: [['id', 'ASC']] });
    const validationError = validatePayload(payload, !existing);

    if (validationError) {
      return res.status(400).json({
        success: false,
        error: validationError
      });
    }

    let profile;

    if (existing) {
      await existing.update({
        ...payload,
        updated_by: req.user ? req.user.id : null
      });
      profile = await getCurrentStoreProfile();
    } else {
      profile = await StoreProfile.create({
        ...payload,
        created_by: req.user ? req.user.id : null,
        updated_by: req.user ? req.user.id : null
      });
      profile = await StoreProfile.findByPk(profile.id, {
        include: includeUsers()
      });
    }

    res.json({
      success: true,
      store_profile: serializeProfile(req, profile)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.uploadStoreLogo = async (req, res) => {
  try {
    const uploadedFile = req.file || (req.files && (req.files.logo || req.files.file || req.files.image || [])[0]);

    if (!uploadedFile) {
      return res.status(400).json({
        success: false,
        error: 'Logo image is required. Upload it using form-data field name logo.'
      });
    }

    const existing = await StoreProfile.findOne({ order: [['id', 'ASC']] });
    const logoPath = `/uploads/store/${uploadedFile.filename}`;

    let profile;

    if (existing) {
      await existing.update({
        logo: logoPath,
        updated_by: req.user ? req.user.id : null
      });
      profile = await getCurrentStoreProfile();
    } else {
      profile = await StoreProfile.create({
        store_name: req.body.store_name || 'MPOS Store',
        currency_code: 'LKR',
        logo: logoPath,
        created_by: req.user ? req.user.id : null,
        updated_by: req.user ? req.user.id : null
      });
      profile = await StoreProfile.findByPk(profile.id, {
        include: includeUsers()
      });
    }

    res.status(201).json({
      success: true,
      logo: logoPath,
      logo_url: buildPublicUrl(req, logoPath),
      store_profile: serializeProfile(req, profile)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
