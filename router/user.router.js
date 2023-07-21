const express = require('express')
const router = express.Router();
const uservalidation = require('../middleware.js/validation/user.validation')
const userController = require('../controller/userorg.controller')

router.post('/sendmail-otp', userController.sendotpbyemail)
router.post('/phonenumber-otp', userController.phonenumberotp)
router.post('/forgotuser', userController.forgotuser)
router.post('/forgotusermobile', userController.forgotusermobile)
router.post('/verifyuserotp', userController.verifyuserotp)
router.post('/verifyuserupdatepassword', userController.verifyuserupdatepassword)
router.put('/updatepassword', userController.updatepassword)
router.put('/updatemobilepassword', userController.updatemobilepassword)
router.post('/payment-completed', userController.paymentCompletedEmailTrigger)
module.exports = router