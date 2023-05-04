const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");
const User = require("../models/userModel");
const stripe = require("stripe")(
  "sk_test_51MLq0vDswle805Hz2bhaI3P3zwWG9eyfocmRjUspy446Kn7GLOMnG8DxYTZDoqSIPUaQjaJgB9Kqbw4MYiAbHIjK00SeKGO88Y"
);
const { v4: uuidv4 } = require("uuid");
const { authMiddleware } = require("../middlewares/authMiddleware");
router.post("/bookcar", async (req, res) => {
  const { token } = req.body;
  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.charges.create(
      {
        amount: req.body.totalMoney,
        currency: "inr",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );
    if (payment) {
      req.body.transactionId = payment.source.id;
      const newbooking = new Booking(req.body);
      await newbooking.save();
      const car = await Car.findOne({ _id: req.body.carid });
      car.bookedTimeSlots.push(req.body.bookedTimeSlots);
      await car.save();
      res.send("Your booking is successfull");
    } else {
      return res.status(400).json(error);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
});
router.post("/bookingcar", async (req, res) => {
  try {
    req.body.transactionId = uuidv4();
    const newbooking = new Booking(req.body);
    await newbooking.save();
    const car = await Car.findOne({ _id: req.body.carid });
    await car.save();
    res.send("Your booking is successfull");
  } catch {
    return res.status(400).json(error);
  }
});
router.get("/getallbookings", authMiddleware, async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  try {
    const bookings = await Booking.find().populate("carid").populate("userid");
    res.send(bookings);
  } catch (error) {
    return res.status(400).json(error);
  }
});
router.get("/get-booking/by-owner", authMiddleware, async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  let bookings = [];
  try {
    const cars = await Car.find({
      user: _id,
    });
    for await (const car of cars) {
      const booking = await Booking.find({
        carid: car._id,
      })
        .populate("carid")
        .populate("userid");
      bookings.push(booking);
    }
    res.send(bookings);
  } catch (error) {
    return res.status(400).json(error);
  }
});
router.post("/update-status", async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.body._id });
    await booking.updateOne({ $set: { approve: req.body.approve } });
    // const resetUrl = `Hi, Please follow this link to reset Your Password . this link  is valid till 10 minutes from now`;
    // const datas = {
    //   to: "nguyenchinh291298@gmail.com",
    //   text: "Hey USER",
    //   subject: "Forgot Password Link",
    //   html: resetUrl,
    // };
    // sendMail(datas);
    res.send({
      id: req.body._id,
      status: "success",
      approve: req.body.approve,
    });
  } catch {
    return res.status(400).json(error);
  }
});

router.post("/update", async (req, res) => {
  id = req.body._id;
  totalHours = req.body.totalHours;
  totalMoney = req.body.totalMoney;
  bookedTimeSlots = req.body.bookedTimeSlots;
  driverRequired = req.body.driverRequired;
  const bookingUpdate = await Booking.findByIdAndUpdate(
    id,
    { totalHours, totalMoney, bookedTimeSlots, driverRequired },
    {
      new: true,
    }
  );
  const booking = await Booking.findById(id)
    .populate("userid")
    .populate("carid");
  res.send({
    booking,
    status: "success",
  });
});

router.post("/delete", async (req, res) => {
  try {
    await Booking.findOneAndDelete({ _id: req.body._id });
    res.json({
      status: "success",
      id: req.body._id,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
