const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");

//router.get("/qrCode/:qrID", authController.qrcode);
router.post("/addqrCode", authController.addQRcode);


module.exports = router;
