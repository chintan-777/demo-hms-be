const express = require("express");
const router = express.Router();

const userController = require("../controller/user.controller");
const authController = require("../controller/auth.controller");
const mailController = require("../controller/mail.controller");

router.post("/register", userController.register);
router.post("/sign-in", authController.signIn);
router.post("/logout", authController.logout);

router.post("/send", mailController.sendMail);

module.exports = router;
