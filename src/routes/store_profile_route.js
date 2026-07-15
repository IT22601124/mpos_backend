const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const storeProfileController = require('../controllers/store_profile_controller');

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'store');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename(_req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `store-logo-${Date.now()}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter(_req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }

    cb(null, true);
  }
});

const uploadLogo = (req, res, next) => {
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'file', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ])(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    res.status(400).json({
      success: false,
      error: error.message
    });
  });
};

router.get('/store-profile', authMiddleware, storeProfileController.getStoreProfile);
router.put('/store-profile', authMiddleware, storeProfileController.saveStoreProfile);
router.post('/store-profile', authMiddleware, storeProfileController.saveStoreProfile);
router.post('/store-profile/logo', authMiddleware, uploadLogo, storeProfileController.uploadStoreLogo);

router.get('/settings/store-profile', authMiddleware, storeProfileController.getStoreProfile);
router.put('/settings/store-profile', authMiddleware, storeProfileController.saveStoreProfile);
router.post('/settings/store-profile', authMiddleware, storeProfileController.saveStoreProfile);
router.post('/settings/store-profile/logo', authMiddleware, uploadLogo, storeProfileController.uploadStoreLogo);

module.exports = router;
