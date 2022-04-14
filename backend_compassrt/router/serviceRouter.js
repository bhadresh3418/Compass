const express = require("express")
const router = express.Router()

const liveDataController = require("../src/controller/liveDataController")

// setting get route endpoint and pointing it to execute getData function from liveDataController
router.get("/getData", liveDataController.getData);

module.exports = router