const express = require("express")
const router = express.Router()

const userController = require("../src/controllers/userController")

const verifyToken = require("../src/middlewares/verifyToken");

// setting get route endpoint and pointing it to execute getData function from liveDataController
router.get("/getUser",verifyToken ,userController.getUser);

module.exports = router