const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");
const stripe = require("stripe")(
  "sk_test_51MLq0vDswle805Hz2bhaI3P3zwWG9eyfocmRjUspy446Kn7GLOMnG8DxYTZDoqSIPUaQjaJgB9Kqbw4MYiAbHIjK00SeKGO88Y"
);
const { v4: uuidv4 } = require("uuid");
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
router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("carid");
    res.send(bookings);
  } catch (error) {
    return res.status(400).json(error);
  }
});
module.exports = router;
