const express = require("express");
const { providerAll } = require("../controller/providerCtrl");

const router = express.Router();

router.get("/get-all", providerAll);

module.exports = router;
