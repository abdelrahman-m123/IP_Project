const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router();



router.post('/createAccount',authController.createAccount);
router.post('/sginin',authController.signin);
router.PATCH('/activateAccount',authController.activateAccount);
router.PATCH('/changePasword',authController.changePassword);
router.delete('/deleteAccount',authController.deleteAccount);

module.exports = router;