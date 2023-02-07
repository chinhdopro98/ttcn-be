const mongoose = require("mongoose");

const autoMakerSchema = new mongoose.Schema({
  name_automaker: { type: String, require: true },
  id_category: { type: mongoose.Schema.Types.ObjectId, ref: "categorys" },
});
const autoMakerModel = mongoose.model("automaker", autoMakerSchema);

module.exports = autoMakerModel;
