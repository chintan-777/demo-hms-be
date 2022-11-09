const mongoose = require("mongoose");

const User = require("../model/user.model");

exports.register = async (req, res, next) => {
  if (req.body.role) {
    if (!["admin", "super-admin", "user"].includes(req.body.role)) {
      res.status(401).send({ message: "Enter valid role" });
      return;
    }
  }
  const user = new User({ ...req.body });
  user
    .save()
    .then((user) => {
      req.user = user;
      next();
      res.status(201).send({});
    })
    .catch((err) => {
      res.send({ message: err.message });
    });
};

exports.users = async (req, res, next) => {
  const query = await User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log("object", err);
    });
};

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
