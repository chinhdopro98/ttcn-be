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
    numbereatSeats: { type: Number, require: true },
    origin: { type: String, require: true },
    colorOutSide: { type: String, require: true },
    status: { type: Number, require: true },
    colorInSide: { type: String, require: true },
    consumeFuels: { type: String, require: true },
    doorNumber: { type: Number, require: true },
    popular: { type: Boolean, require: true },
    gear: { type: Number, require: true },
    note: { type: String, require: true },
    bookedTimeSlots: [
      {
        from: { type: String, required: true },
        to: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const carModel = mongoose.model("cars", carSchema);
module.exports = carModel;
