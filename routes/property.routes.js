const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const router = express.Router();

const fs = require("fs");
const path = require("path");
var multer = require("multer");
var upload = multer({ dest: "./upload" });

const Property = require("../model/property.model");
const { validate } = require("../model/room.model");

router.post("/", upload.array("file"), (req, res) => {
  res.header("Content-Type", "application/json");
  const property = new Property({
    ...req.body,
    images: req.files && req.files.length !== 0 ? req.files : [],
    createdOn: new Date(),
  });
  property
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(400);
      const errMessage = err.keyPattern?.email
        ? "Email Already added"
        : err.keyPattern?.phone
        ? "Phone already added"
        : "";
      res.send({ message: errMessage });
    });
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

router.put("/:id", upload.array("file"), async (req, res) => {
  res.header("Content-Type", "application/json");
  const query = await Property.findOneAndUpdate(
    { _id: req.params.id },
    {
      ...req.body,
      images: req.files && req.files.length !== 0 ? req.files : [],
    }
  ).exec(async (err, property) => {
    if (!property) {
      res.status(404);
      res.send({ message: "Property Not Found" });
    } else {
      await Promise.all(
        property.images.map(async (img) => {
          return await fs.unlink(
            path.join(__dirname + "/../" + img.path),
            (err) => {
              console.log("first", err);
            }
          );
        })
      );
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
