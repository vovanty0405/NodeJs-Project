const express = require('express');
const router = express.Router();
const apiProjectController = require('../app/controllers/ApiProjectController');

// Khai báo các endpoint API
router.get('/projects', apiProjectController.getAll);
router.get('/projects/:id', apiProjectController.getOne);
router.put('/projects/:id', apiProjectController.update);
router.delete('/projects/:id', apiProjectController.delete);

module.exports = router;