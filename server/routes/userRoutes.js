const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../upload');

router.post('/api/auth/signup', userController.signup);
router.post('/api/auth/login', userController.login);
router.post('/api/sauces', upload, userController.updateAnUserImage);

module.exports = router;
