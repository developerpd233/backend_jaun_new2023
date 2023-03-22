const express = require("express");
const isAuth = require("../middleware/isAuth");
const paypalCtrl = require("../controllers/paypal");

const router = express.Router();
router.get("/client_token",isAuth,paypalCtrl.clientToken);
router.post("/checkout",isAuth,paypalCtrl.checkout);

router.post("/subscription-customer-token",isAuth,paypalCtrl.subscriptionCustomerToken);
router.post("/subscription-payment-method",isAuth,paypalCtrl.subscriptionPaymentMethod);


module.exports = router;
