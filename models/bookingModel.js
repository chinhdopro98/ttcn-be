const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    carid: { type: mongoose.Schema.Types.ObjectId, ref: "cars" },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    totalHours: { type: Number },
    totalMoney: { type: Number },
    bookedTimeSlots: {
      from: { type: String, require: true },
      to: { type: String, require: true },
    },
    statusPayment: { type: Number, require: true },
    approve: { type: Number, require: true },
    transactionId: { type: String },
    driverRequired: { type: String },
  },
  { timestamps: true }
);
const bookingModel = mongoose.model("bookings", bookingSchema);

module.exports = bookingModel;
