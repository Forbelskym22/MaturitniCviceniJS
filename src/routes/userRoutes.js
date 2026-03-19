const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/register', userController.getRegister);
router.post('/register', userController.postRegister);

// Settings and Profile management
router.get('/settings', userController.getSettings);
router.post('/settings/update', userController.updateProfile);
router.post('/settings/delete', userController.deleteAccount);

module.exports = router;
