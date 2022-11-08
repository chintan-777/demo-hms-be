const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const router = express.Router();

const Property = require("../model/property.model");

router.post("/", (req, res) => {
  res.header("Content-Type", "application/json");
  console.log("req", req.body);
  const property = new Property({
    ...req.body,
    createdOn: new Date(),
  });
  property.save();
  res.send(property);
});

router.get("/", async (req, res) => {
  res.header("Content-Type", "application/json");
  const query = await Property.find({}).exec(async (err, data) => {
    res.send(data);
  });
});

router.get("/:id", async (req, res) => {
  res.header("Content-Type", "application/json");
  const query = await Property.findById(req.params.id).exec(
    async (err, data) => {
      if (!data) {
        res.status(404);
        res.send({ message: "Property Not Found" });
      }
      res.send(data);
    }
  );
});

router.patch("/:id", async (req, res) => {
  console.log("object", req.params.id);
  res.header("Content-Type", "application/json");
  const query = await Property.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body }
  ).exec((err, property) => {
    if (!property) {
      res.status(404);
      res.send({ message: "Property Not Found" });
    } else {
      res.send({ ...property._doc, ...req.body });
    }
  });
  // console.log("first", query);
});

router.delete("/:id", async (req, res) => {
  res.header("Content-Type", "application/json");
  const query = await Property.findByIdAndRemove(req.params.id).exec(
    async (err, data) => {
      if (!data) {
        res.status(404);
        res.send({ message: "Property Not Found" });
      }
      res.send(data);
    }
  );
});

module.exports = router;
