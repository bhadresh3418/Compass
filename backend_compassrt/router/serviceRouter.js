const express = require("express")
const router = express.Router()
const verifyToken = require("../src/middlewares/verifyToken");
const liveDataController = require("../src/controllers/liveDataController")

// setting get route endpoint and pointing it to execute getData function from liveDataController
router.get("/getData", verifyToken, liveDataController.getData);

module.exports = router