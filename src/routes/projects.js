const express = require('express');
const router = express.Router();
const projectController = require('../app/controllers/ProjectController');

// Khớp với action của form
router.get('/create', projectController.create);
router.post('/store', projectController.store);
router.get('/:id/edit', projectController.edit);
router.put('/:id', projectController.update);
router.post('/handle-form', projectController.handleForm);
router.post('/handleRestore-form', projectController.handleRestoreForm);
router.delete('/:id', projectController.delete);
router.patch('/:id/restore', projectController.restore);
router.delete('/:id/force', projectController.forceDelete);
router.get('/:slug', projectController.Show)
module.exports = router;