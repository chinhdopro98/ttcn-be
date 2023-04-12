const Car = require("../models/carModel");
const asyncHandler = require("express-async-handler");

const getAllCars = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields", "search"];
  excludeFields.forEach((el) => delete queryObj[el]);
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
  try {
    let query = Car.find(JSON.parse(queryStr));
    // sortting;
    if (req.query.sort) {
      if (+req.query.sort === 1) {
        query = query.sort({ price: 1 });
      } else {
        query = query.sort({ price: -1 });
      }
    } else {
      query = query.sort("-createdAt");
    }
    if (req.query.search !== "") {
      const { search } = req.query.search;
      const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
      const searchRgx = rgx(search);
      query = query.find({ name: { $regex: req.query.search, $options: "i" } });
    }
    // limiting the fields

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    let carCount = 1;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const { search } = req.query.search;
      const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
      const searchRgx = rgx(search);
      const searhname = Car.find({
        name: { $regex: req.query.search, $options: "i" },
      });
      carCount = await Car.countDocuments(searhname);
      if (skip >= carCount) throw new Error("Page not does not exists");
    }
    const car = await query;
    res.json({
      carCount: carCount,
      cars: car,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const getCar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findCar = await Car.findById(id);
    res.json(findCar);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  getAllCars,
  getCar,
};
