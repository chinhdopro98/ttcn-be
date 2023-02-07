const express = require("express");

const router = express.Router();

const Category = require("../models/categoryModel");

router.get("/getall", async (req, res) => {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
