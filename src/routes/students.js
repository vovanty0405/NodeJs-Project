const express = require('express');
const router = express.Router();
const studentController = require('../app/controllers/StudentController');

router.get('/', studentController.getAll);
//router.get('/students/:id', studentController.getOne);
//router.put('/students/:id', studentController.update);
//router.delete('/students/:id', studentController.delete);
router.post('/', studentController.create);
router.put('/:id', studentController.update);
router.delete('/:id', studentController.delete);

module.exports = router;