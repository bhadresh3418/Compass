const express = require("express")
const router = express.Router()

const userController = require("../src/controller/userController")

const verifyToken = require("../src/middleware/verifyToken");

// setting get route endpoint and pointing it to execute getData function from liveDataController
router.get("/getUser",verifyToken ,userController.getUser);

module.exports = router