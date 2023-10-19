const express = require('express')
const router = express.Router();
const { client } = require('../client');
const { generateJWT } = require('../jwt')

const notificationController = require('../controller/notification.controller')



router.post('/mailtriger',notificationController.mailtrigeer)
router.get('/users',notificationController.users)
router.post('/userupdate',notificationController.userupdate)
router.post('/sendemail',notificationController.sendmail)
router.post('/tablecreat/notification',notificationController.postnotification)
router.post('/tableupdate/notification',notificationController.projectnotification)
router.post('/postlike/notification',notificationController.postlikenotification)
router.post('/postcommand/notification',notificationController.postcommandnotification)
router.post('/repostnotification',notificationController.repostnotification)
router.delete('/deleteimage',notificationController.deleteimage)
router.delete('/deleteallimages',notificationController.deleteallimage)
// router.post('/projectapp',notificationController.appProjectNotifucation)
// router.post('/postapp',notificationController.apppostNotifucation)
// router.post('/projectnotificationfalse',notificationController.projectfalseNotification)
// router.post('/customersupport',notificationController.customerNotification)
// router.post('/ticketnotification',notificationController.ticketNotification)

module.exports = router