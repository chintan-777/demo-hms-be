const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PropertySchema = new Schema({
  name: String,
  description: String,
  createdOn: Date,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  facility: [String],
  images: [
    {
      fieldname: String,
      originalname: String,
      encoding: String,
      mimetype: String,
      destination: String,
      filename: String,
      path: String,
      size: Number,
    },
  ],
});

const Property = new mongoose.model("property", PropertySchema);

module.exports = Property;
