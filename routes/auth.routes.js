const express = require("express");
const router = express.Router();

const userController = require("../controller/user.controller");
const authController = require("../controller/auth.controller");

router.post("/register", userController.register);
router.post("/sign-in", authController.signIn);
router.post("/logout", authController.logout);

module.exports = router;
