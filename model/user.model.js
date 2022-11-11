const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  password: { type: String, required: true },
});

const User = new mongoose.model("user", UserSchema);

module.exports = User;
