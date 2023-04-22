const mongoose = require("mongoose");

var providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false,
  },
  name_with_type: {
    type: String,
    required: false,
  },
  code: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("provider", providerSchema);
