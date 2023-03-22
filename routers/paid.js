const express = require("express");
const isAuth = require("../middleware/isAuth");
const paidCtrl = require("../controllers/paidCtrl");


const router = express.Router();

router.post("/setUserPaidFor",isAuth,paidCtrl.setUserPaidFor);

module.exports = router;
