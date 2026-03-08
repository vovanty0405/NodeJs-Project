const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');

// Tuyến đường cho trang chủ
router.get('/', siteController.home);

module.exports = router;