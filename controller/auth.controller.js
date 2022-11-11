const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/user.model");

const SECRET_KEY = "TEST_IT_OUT";

exports.signIn = async (req, res, next) => {
  let token = req.cookies?.auth_token;
  if (token) {
    let verifiedUser = jwt.verify(token, SECRET_KEY);
    res.status(200).send(verifiedUser.user);
    return;
  }

  if (!req.body.email) {
    res.status(400).send({ message: "E-mail is needed buddy" });
    return;
  }
  if (!req.body.password) {
    res.status(400).send({ message: "Password is needed buddy" });
    return;
  }

  await User.findOne({ email: req.body.email })
    .then(async (user) => {
      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass)
        return res.status(401).send({ message: "Email or Password is wrong" });

      let localUser = { ...user._doc };
      delete localUser.password;
      let token = null;
      try {
        token = await jwt.sign({ user: localUser }, SECRET_KEY, {
          expiresIn: "1h",
        });
        res.cookie("auth_token", token);
        return res.status(200).send(localUser);
      } catch (err) {
        return res
          .status(400)
          .send({ messgae: "Error! Something went wrong." });
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
  // let hashPassword;
  // const salt = await bcrypt.genSalt(10);
  // if (req.body.password) {
  //   hashPassword = await bcrypt.hash(req.body.password, salt);
  // } else {
  //   hashPassword = await bcrypt.hash("Abc@@123#", salt);
  // }
};
