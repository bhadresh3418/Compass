const express = require("express")
const router = express.Router()

const authController = require("../src/controllers/authController");

// setting get route endpoint and pointing it to execute function from authController
router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router