const express = require("express");
const isAuth = require("../middleware/isAuth");
const chatCtrl = require("../controllers/chatCtrl");


const router = express.Router();

router.get("/getContacts",isAuth,chatCtrl.getContacts);
router.get("/getHistory/:userId",isAuth ,chatCtrl.getHistory);


module.exports = router;
