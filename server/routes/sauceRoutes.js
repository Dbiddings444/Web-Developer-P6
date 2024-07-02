const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauceController');
const authorize = require('../controllers/userController');
const upload = require('../middleWare/upload');

router.post('/api/sauces',upload, authorize.verify, sauceController.createSauce);
router.get('/api/sauces/:id',authorize.verify, sauceController.getOneSauce);
router.get('/api/sauces', authorize.verify, sauceController.getAllSauces);
// router.put('/api/sauces/:id', upload, userController.updateAnUserImage);
router.delete('/api/sauces/:id', sauceController.deleteSauce);
// router.post('/api/sauces/:id/like', userController.login);

module.exports = router;
