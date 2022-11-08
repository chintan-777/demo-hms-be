const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const RoomSchema = new Schema({
  propertyId: ObjectId,
  type: String,
  count: Number,
  price: Number,
  bed: Number,
  createdOn: Date,
});

const Room = mongoose.model("room", RoomSchema);

module.exports = Room;
