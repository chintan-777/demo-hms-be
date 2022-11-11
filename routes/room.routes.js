const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const router = express.Router();

const Property = require("../model/property.model");
const Room = require("../model/room.model");

router.post("/", async (req, res) => {
  const query = await Property.findById(req.body.propertyId).exec(
    async (err, data) => {
      if (!data) {
        res.status(404);
        res.header("Content-Type", "application/json");
        res.send({ message: "Property Not Found" });
        // return;
      }
      console.log("first", err);
      const roomData = new Room({ ...req.body, createdOn: new Date() });
      await roomData.save();
      res.header("Content-Type", "application/json");
      res.send(roomData);
    }
  );
});

router.get("/", async (req, res) => {
  res.header("Content-Type", "application/json");
  const queries = {};
  if (req.query.propertyId) {
    queries.propertyId = req.query.propertyId;
  }
  const query = await Room.find({ ...queries }).exec(async (err, data) => {
    if (err) {
      res.status(404);
      res.send({ message: "Internal Error" });
    }
    res.send(data);
  });
});

router.get("/:id", async (req, res) => {
  res.header("Content-Type", "application/json");
  const query = await Room.findById(req.params.id).exec(async (err, data) => {
    if (!data) {
      res.status(404);
      res.send({ message: "Room Not Found" });
    }
    res.send(data);
  });
});

router.patch("/:id", async (req, res) => {
  console.log("object", req.params.id);
  res.header("Content-Type", "application/json");
  const query = await Room.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body }
  ).exec((err, room) => {
    if (!room) {
      res.status(404);
      res.send({ message: "Room Not Found" });
    } else {
      res.send({ ...room._doc, ...req.body });
    }
  });
  // console.log("first", query);
});

router.delete("/:id", async (req, res) => {
  res.header("Content-Type", "application/json");
  const query = await Room.findByIdAndRemove(req.params.id).exec(
    async (err, data) => {
      if (!data) {
        res.status(404);
        res.send({ message: "Room Not Found" });
      }
      res.send(data);
    }
  );
});

module.exports = router;
