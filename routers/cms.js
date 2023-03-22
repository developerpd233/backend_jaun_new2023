
const express = require("express");
const router = express.Router();
const cmsController = require("../controllers/cmsCtrl");

router.get("/cms/:slug", cmsController.view);
module.exports = router;










