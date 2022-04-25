const express = require("express")
const router = express.Router()
const verifyToken = require("../src/middlewares/verifyToken");
const stockController = require("../src/controllers/stockController")

// setting get route endpoint and pointing it to execute getData function from liveDataController
router.get("/stockLookup", verifyToken, stockController.stockLookup);
router.get("/getWatchlist", verifyToken, stockController.getWatchlist);
router.post("/addToWatchlist", verifyToken, stockController.addToWatchlist);

module.exports = router