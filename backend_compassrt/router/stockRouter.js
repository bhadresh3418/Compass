const express = require("express")
const router = express.Router()
const checkToken = require("../src/middleware/verifyToken");
const stockController = require("../src/controller/stockController")

// setting get route endpoint and pointing it to execute getData function from liveDataController
router.get("/stockLookup", checkToken, stockController.stockLookup);

module.exports = router