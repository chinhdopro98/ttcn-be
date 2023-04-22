const express = require("express");
const {
  getAllCars,
  getCar,
  deleteCar,
  getCarByUser,
  approveCar,
} = require("../controller/carCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/getallcars", authMiddleware, getAllCars);
router.get("/get-one/:id", getCar);
router.delete("/delete/:id", deleteCar);
router.patch("/approve/:id", approveCar);
router.get("/user-car", authMiddleware, getCarByUser);
// router.get("/getallcars", async (req, res) => {});
// router.post("/add-car", async (req, res) => {
//   try {
//     const newcar = new Car(req.body);
//     await newcar.save();
//     res.send("Car added succesfully");
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// });

// router.post("/edit-car", async (req, res) => {
//   try {
//     const car = await Car.findOne({ _id: req.body._id });
//     car.name = req.body.name;
//     car.capacity = req.body.capacity;
//     car.fuelType = req.body.fuelType;
//     car.autoMarket = req.body.autoMarket;
//     car.status = req.body.status;
//     car.doorNumber = req.body.doorNumber;
//     car.yearCreated = req.body.yearCreated;
//     car.price = req.body.price;
//     car.numbereatSeats = req.body.numbereatSeats;
//     car.origin = req.body.origin;
//     car.colorOutSide = req.body.colorOutSide;
//     car.colorInSide = req.body.colorInSide;
//     car.popular = req.body.popular;
//     car.gear = req.body.gear;
//     car.note = req.body.note;
//     car.image = req.body.image;
//     car.origin = req.body.origin;
//     await car.save();
//     res.send("Update car succesfully");
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// });

// router.post("/delete-car", async (req, res) => {
//   try {
//     await Car.findOneAndDelete({ _id: req.body._id });
//     res.send("Car delete succesfully");
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// });
module.exports = router;
