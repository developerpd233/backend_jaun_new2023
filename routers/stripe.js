const express = require("express");
const bodyParser = require('body-parser');
const isAuth = require("../middleware/isAuth");
const stripeCtrl = require("../controllers/stripeCtrl");
const router = express.Router();



router.post("/payment-sheet",isAuth,stripeCtrl.PaymentSheet);
router.post("/create-payment-intent",isAuth,stripeCtrl.createPaymentIntent);
router.post("/create-customer",isAuth,stripeCtrl.createCustomer);
router.post("/create-subscriptions",isAuth,stripeCtrl.createSubscriptions);
router.post("/invoice-preview",isAuth,stripeCtrl.invoicePreview);
router.get("/subscriptions/:customerId",isAuth,stripeCtrl.subscriptions);
router.post("/payment-intents-success",isAuth,stripeCtrl.PaymentIntentsSuccess);



//router.get("/webhook",bodyParser.raw({ type: 'application/json' }),stripeCtrl.subscriptions);



module.exports = router;
