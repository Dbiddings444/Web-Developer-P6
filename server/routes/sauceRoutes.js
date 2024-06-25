const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauceController');
const upload = require('../upload');

router.post('/api/sauces', userController.signup);
router.get('/api/sauces/:id', sauceController.getOneSauce);
router.get('/api/sauces', sauceController.getAllSauces);
router.put('/api/sauces/:id', upload, userController.updateAnUserImage);
router.delete('/api/sauces/:id', userController.login);
router.post('/api/sauces/:id/like', userController.login);

module.exports = router;
