const Car = require("../models/carModel");
const Blog = require("../models/blogModel");
const Booking = require("../models/bookingModel");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const getAllCars = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields", "search"];
  excludeFields.forEach((el) => delete queryObj[el]);
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
  try {
    let query = Car.find(JSON.parse(queryStr)).populate("user");
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
    if (user.role !== "admin") {
      query = query.find({
        active: "true",
        hide: true,
      });
    }
    // pagination

    const page = +req.query.page;
    const limit = +req.query.limit;
    const skip = (page - 1) * limit;
    let carCount = 1;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const { search } = req.query.search;
      const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
      const searchRgx = rgx(search);
      let searhname;
      if (user.role === "admin") {
        searhname = Car.find({
          name: { $regex: req.query.search, $options: "i" },
        });
      } else {
        searhname = Car.find({
          name: { $regex: req.query.search, $options: "i" },
          active: "true",
          hide: true,
        });
      }
      carCount = await Car.countDocuments(searhname);
      if (skip >= carCount) throw new Error("Page not does not exists");
    }
    const car = await query;
    res.json({
      carCount: carCount,
      cars: car,
    });
  } catch (error) {
    res.json({
      carCount: 0,
      cars: [],
    });
  }
});
const getCar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findCar = await Car.findById(id).populate("user");
    res.json(findCar);
  } catch (error) {
    throw new Error(error);
  }
});

const getCarByUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findCar = await Car.find({
      user: _id,
    });
    res.json(findCar);
  } catch (error) {
    throw new Error(error);
  }
});

const createCar = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  try {
    const name = req.body.name;
    const image = req.file.path;
    const capacity = +req.body.capacity;
    const fuelType = +req.body.fuelType;
    const yearCreated = +req.body.yearCreated;
    const price = +req.body.price;
    const autoMarket = req.body.autoMarket;
    const colorOutSide = req.body.colorOutSide;
    const colorInSide = req.body.colorInSide;
    const origin = req.body.origin;
    const consumeFuel = req.body.consumeFuel;
    const doorNumber = +req.body.doorNumber;
    const gear = +req.body.gear;
    const note = req.body.note;
    const status = +req.body.status;
    const provider = req.body.provider;
    const address = req.body.address;
    const newCar = await Car.create({
      name,
      image,
      capacity,
      fuelType,
      yearCreated,
      autoMarket,
      price,
      origin,
      colorOutSide,
      colorInSide,
      consumeFuel,
      doorNumber,
      gear,
      note,
      status,
      provider,
      address,
      user: _id,
      active: user.role === "admin" ? true : false,
    });
    res.json({
      status: "success",
      newCar,
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateCar = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  const user = await User.findById(_id);
  const name = req.body.name;
  const capacity = +req.body.capacity;
  const fuelType = +req.body.fuelType;
  const yearCreated = +req.body.yearCreated;
  const price = +req.body.price;
  const autoMarket = req.body.autoMarket;
  const colorOutSide = req.body.colorOutSide;
  const colorInSide = req.body.colorInSide;
  const origin = req.body.origin;
  const consumeFuel = req.body.consumeFuel;
  const doorNumber = +req.body.doorNumber;
  const gear = +req.body.gear;
  const note = req.body.note;
  const status = +req.body.status;
  const provider = req.body.provider;
  const address = req.body.address;
  let updateCar;
  try {
    if (!req.file) {
      updateCar = await Car.findByIdAndUpdate(id, {
        name,
        capacity,
        fuelType,
        yearCreated,
        autoMarket,
        price,
        origin,
        colorOutSide,
        colorInSide,
        consumeFuel,
        doorNumber,
        gear,
        note,
        status,
        provider,
        address,
        // active: user.role === "admin" ? true : false,
      });
    } else {
      const image = req.file.path;
      updateCar = await Car.findByIdAndUpdate(id, {
        image,
        name,
        capacity,
        fuelType,
        yearCreated,
        autoMarket,
        price,
        origin,
        colorOutSide,
        colorInSide,
        consumeFuel,
        doorNumber,
        gear,
        note,
        status,
        provider,
        address,
        // active: user.role === "admin" ? true : false,
      });
    }
    res.json({
      status: "success",
      updateCar: await Car.findById(id),
    });
  } catch (error) {
    throw new Error(error);
  }
});
const deleteCar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleteDate = await Car.findByIdAndDelete(id);
  res.json({
    status: "success",
    id,
  });
  try {
  } catch (error) {
    throw new Error(error);
  }
});
const approveCar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const approveCar = await Car.findByIdAndUpdate(id, {
    active: req.body.active === 1 ? "true" : "false",
  });
  res.json({
    status: "success",
    id,
    active: req.body.active,
  });
  try {
  } catch (error) {
    throw new Error(error);
  }
});

const hishowCar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hideShowCar = await Car.findByIdAndUpdate(id, {
    hide: !req.body.hide,
  });
  res.json({
    status: "success",
    id,
    hide: req.body.hide,
  });
  try {
  } catch (error) {
    throw new Error(error);
  }
});

const totalData = asyncHandler(async (req, res) => {
  const totalCar = await Car.count();
  const totalUser = await User.count();
  const totalBooking = await Booking.count();
  const totalBlog = await Blog.count();
  res.json({ totalCar, totalUser, totalBooking, totalBlog });
});
module.exports = {
  getAllCars,
  getCar,
  createCar,
  deleteCar,
  updateCar,
  getCarByUser,
  approveCar,
  hishowCar,
  totalData,
};
