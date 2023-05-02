const express = require("express");

const router = express.Router();

const autoMakerModel = require("../models/autoMakerModel");

router.get("/getall", async (req, res) => {
  try {
    const autoMakers = await autoMakerModel.find();

    res.send(autoMakers);
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/edit-automaker", async (req, res) => {
  try {
    const automaker = await autoMakerModel.findOne({ _id: req.body._id });
    automaker.name_automaker = req.body.name_automaker;
    automaker.id_category = req.body.id_category;
    await automaker.save();
    res.send("Update automaker succesfully");
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/delete-automaker", async (req, res) => {
  try {
    await autoMakerModel.findOneAndDelete({ _id: req.body._id });
    res.send("Automaker delete succesfully");
  } catch (error) {
    return res.status(400).json(error);
  }
});
router.post("/create", async (req, res) => {
  try {
    const automaker = new autoMakerModel({
      name_automaker: req.body.name_automaker,
      id_category: req.body.id_category,
    });
    await automaker.save();
    res.send("Automaker created succesfully");
  } catch (error) {
    return res.status(400).json(error);
  }
});
module.exports = router;
