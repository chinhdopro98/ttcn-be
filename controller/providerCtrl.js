const Provider = require("../models/providerModel");
const asyncHandler = require("express-async-handler");
const providerAll = asyncHandler(async (req, res) => {
  try {
    const providers = await Provider.find();
    res.json({
      providers,
    });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  providerAll,
};
