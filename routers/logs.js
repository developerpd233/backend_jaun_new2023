const express = require("express");

const router = express.Router();
const logsCtrl = require("../controllers/logsCtrl");
router.post("/store",logsCtrl.store);

module.exports = router;
