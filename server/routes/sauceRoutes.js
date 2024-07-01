const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauceController');
const authorize = require('../middleWare/authorize');
const upload = require('../middleWare/upload');

router.post('/api/sauces',upload, authorize, sauceController.createSauce);
router.get('/api/sauces/:id',authorize, sauceController.getOneSauce);
router.get('/api/sauces',authorize, sauceController.getAllSauces);
// router.put('/api/sauces/:id', upload, userController.updateAnUserImage);
router.delete('/api/sauces/:id', sauceController.deleteSauce);
// router.post('/api/sauces/:id/like', userController.login);

module.exports = router;
