const express = require("express");
//const isAuth = require("../middleware/isAuth");
const cronjobCtrl = require("../controllers/cronjobCtrl");


const router = express.Router();

router.get("/daily-cst-5am",cronjobCtrl.dailyCST5am);


module.exports = router;
