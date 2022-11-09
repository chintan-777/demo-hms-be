const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const router = express.Router();

const userController = require("../controller/user.controller");

router.get("/", userController.users);
router.delete("/:id", userController.deleteUser);

module.exports = router;
