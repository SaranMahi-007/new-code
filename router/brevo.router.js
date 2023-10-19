const express = require('express');
const emailController = require('../controller/brevo.controller');

const router = express.Router();

router.post('/reportmail', emailController.sendBrevoReportEmail);
router.post('/paymentmail', emailController.sendBrevoPaymentEmail);
//router.post('/welcomemail', emailController.sendBrevoWelcome);
router.post('/paymentrefund', emailController.sendBrevoRefund);
router.post('/fileexport', emailController.sendBrevoExport);
router.post('/projectcreate', emailController.sendBrevoProject);
router.post('/SMSbrevo', emailController.sendSMSBrevo )
module.exports = router;
