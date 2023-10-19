const express = require('express')
const router = express.Router();
const validation = require('../middleware.js/validation/auth.validation')

const ngoController = require('../controller/ngoorg.controller')

router.post('/auth/register',ngoController.register)
router.post('/auth/login',ngoController.login)
router.post('/forgot',ngoController.forgot)
router.post('/verifyotp',ngoController.verifyotp)
router.post('/confirmpassword',ngoController.confirmpassword)
 router.post('/usernotification',ngoController.usernotificationTaggle)
 router.post('/userpostnotification',ngoController.userpostNotification)
router.post('/userlike',ngoController.userpostLikeNotification)
router.post('/userrepost',ngoController.userRepostNotification)
router.post('/usercomment',ngoController.userCommentsNotification)
router.post('/userdonate',ngoController.userDonateNotification)



module.exports = router