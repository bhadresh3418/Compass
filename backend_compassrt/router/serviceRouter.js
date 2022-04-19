const express = require("express")
const router = express.Router()
const checkToken = require("../src/middleware/verifyToken");
const liveDataController = require("../src/controller/liveDataController")

// setting get route endpoint and pointing it to execute getData function from liveDataController
router.get("/getData", checkToken, liveDataController.getData);

module.exports = router