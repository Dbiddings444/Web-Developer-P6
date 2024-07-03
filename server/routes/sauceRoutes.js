const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauceController');
const authorize = require('../controllers/userController');
const upload = require('../middleWare/upload');

router.post('/api/sauces', authorize.verify, upload, sauceController.createSauce);
router.get('/api/sauces/:id', authorize.verify, sauceController.getOneSauce);
router.get('/api/sauces', authorize.verify, sauceController.getAllSauces);
router.put('/api/sauces/:id', upload, sauceController.updateSauce);
router.delete('/api/sauces/:id', authorize.verify, sauceController.deleteSauce);
router.post('/api/sauces/:id/like',authorize.verify, sauceController.likes);

module.exports = router;
