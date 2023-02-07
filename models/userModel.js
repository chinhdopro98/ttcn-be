const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: { type: String, require: true },
  email: { type: String, require: true },
  username: { type: String, require: true },
  password: { type: String, require: true },
  phone: { type: String, require: true },
  role: { type: Number, require: true },
});
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
