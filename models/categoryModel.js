const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("categorys", categorySchema);
module.exports = categoryModel;
