const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    image: { type: String, require: true },
    capacity: { type: Number, require: true },
    fuelType: { type: Number, require: true },
    yearCreated: { type: Number, require: true },
    autoMarket: { type: mongoose.Schema.Types.ObjectId, ref: "automakers" },
    price: { type: Number, require: true },
    numbereatSeats: { type: Number, require: false, default: null },
    origin: { type: String, require: true },
    colorOutSide: { type: String, require: true },
    status: { type: Number, require: true },
    colorInSide: { type: String, require: true },
    consumeFuels: { type: String, require: true },
    doorNumber: { type: Number, require: true },
    popular: { type: Boolean, require: false, default: false },
    gear: { type: Number, require: true },
    note: { type: String, require: true },
    active: { type: String, require: true, default: false },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "providers" },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    address: { type: String, require: true },
    bookedTimeSlots: [
      {
        from: { type: String, required: true },
        to: { type: String, required: true },
      },
    ],
    ratings: [
      {
        star: Number,
        comment: String,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      },
    ],
    totalRatings: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

const carModel = mongoose.model("cars", carSchema);
module.exports = carModel;
