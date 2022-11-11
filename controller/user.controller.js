const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/user.model");

const SECRET_KEY = "TEST_IT_OUT";

exports.register = async (req, res, next) => {
  if (req.body.role) {
    if (!["admin", "super-admin", "user"].includes(req.body.role)) {
      res.status(401).send({ message: "Enter valid role" });
      return;
    }
  }
  let hashPassword;
  const salt = await bcrypt.genSalt(10);
  if (req.body.password) {
    hashPassword = await bcrypt.hash(req.body.password, salt);
  } else {
    hashPassword = await bcrypt.hash("Abc@@123#", salt);
  }

  let token = req.cookies?.auth_token;
  if (token) {
    let verifiedUser = jwt.verify(token, SECRET_KEY);
    if (["admin", "super-admin"].includes(req.body.role)) {
      if (verifiedUser.user.role !== "super-admin") {
        res.status(401).send({ message: "You are not authorised" });
        return;
      }
    }
  } else {
    if (req.body.role !== "user") {
      res.status(401).send({ message: "You are not authorised" });
      return;
    }
  }

  const user = await new User({ ...req.body, password: hashPassword });
  user
    .save()
    .then(async (user) => {
      let localUser = { ...user._doc };
      delete localUser.password;
      if (!token) {
        try {
          token = await jwt.sign({ user: localUser }, SECRET_KEY, {
            expiresIn: "1h",
          });
          res.cookie("auth_token", token);
          res.status(200).send(localUser);
          return;
        } catch (err) {
          const error = new Error("Error! Something went wrong.");
          res.status(400).send(error);
          return;
        }
      }
      res.status(200).send(localUser);
    })
    .catch((err) => {
      res.send({ message: err.message });
    });
};

exports.users = async (req, res, next) => {
  let token = req.cookies?.auth_token;
  let queries = [{ role: "user" }];
  let verifiedUser;
  if (token) {
    verifiedUser = jwt.verify(token, SECRET_KEY);
    if (verifiedUser.user.role === "user") {
      res.status(401).send({ message: "You are not authorised" });
      return;
    }
    if (verifiedUser.user.role === "super-admin") {
      queries.push({ role: "admin" });
    }
  } else {
    res.status(401).send({ message: "You are not authorised" });
    return;
  }
  const query = await User.find({})
    .then((users) => {
      res.send(
        users.map((user) => {
          let luser = { ...user._doc };
          delete luser.password;
          return luser;
        })
      );
    })
    .catch((err) => {
      console.log("object", err);
      res.status(400).send({ message: err.message });
    });
};

exports.getUser = async (req, res, next) => {};

exports.deleteUser = async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id)
    .then((data) => {
      if (data) res.status(200).send(data);
      else {
        res.status(404).send({ message: "Record not found" });
      }
    })
    .catch((err) => {
      res.send(err);
    });
};
