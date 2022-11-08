const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PropertySchema = new Schema({
  name: String,
  description: String,
  createdOn: Date,
  email: String,
  phone: String,
});

const Property = mongoose.model("property", PropertySchema);

module.exports = Property;
