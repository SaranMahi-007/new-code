const express = require('express')
const router = express.Router();

const stripeController = require('../controller/stripe.controller')

router.post('/create-customer', stripeController.createcustomer)
router.post('/create-product', stripeController.createproduct)
router.post('/create-subscription', stripeController.createsubscription)
router.delete('/cancel-subscription', stripeController.cancelsubscription)
//router.post('/webhook', stripeController.webhook)
router.post('/change-card', stripeController.changecard)
router.post('/create-account', stripeController.createaccount)
router.post('/create-transfer', stripeController.createtransfer)
router.post('/create-individual-product', stripeController.createindividualproduct)
router.post('/addcard-to-customer', stripeController.addCardToCustomer)
router.get('/get-customer-cards', stripeController.getallCardToCustomer)
router.post('/set-defaultcard', stripeController.setDefaultCard)
//router.post('/remove-customer-card', stripeController.removeCard)
router.post('/remove-product', stripeController.removeProductAndType)
router.delete('/remove-customer-card', stripeController.deletecard)
router.get('/get-customer', stripeController.getCustomerDetails)
router.put('/update-customer-card', stripeController.updatecard)
router.post('/payment_refund', stripeController.refundAmount)

module.exports = router