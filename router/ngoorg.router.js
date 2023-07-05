const express = require('express')
const router = express.Router();
const validation = require('../middleware.js/validation/auth.validation')

const ngoController = require('../controller/ngoorg.controller')

router.post('/auth/register',ngoController.register)
router.post('/auth/login',ngoController.login)
router.post('/forgot',ngoController.forgot)
router.post('/verifyotp',ngoController.verifyotp)
router.post('/confirmpassword',ngoController.confirmpassword)



module.exports = router