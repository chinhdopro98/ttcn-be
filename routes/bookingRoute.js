const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");
const User = require("../models/userModel");
const moment = require("moment");
const stripe = require("stripe")(
  "sk_test_51MLq0vDswle805Hz2bhaI3P3zwWG9eyfocmRjUspy446Kn7GLOMnG8DxYTZDoqSIPUaQjaJgB9Kqbw4MYiAbHIjK00SeKGO88Y"
);
const { v4: uuidv4 } = require("uuid");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { sendMail } = require("../controller/emailCtrl");
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
    const carid = req.body.carid;
    const from = req.body.bookedTimeSlots.from;
    const to = req.body.bookedTimeSlots.to;
    let bookingTo = "";
    let bookingFrom = "";
    const bookings = await Booking.find({ carid: carid });

    let check = false;
    if (bookings.length > 0) {
      bookings.forEach((booking) => {
        if (
          (from > booking.bookedTimeSlots.from &&
            from < booking.bookedTimeSlots.to &&
            booking.approve === 1) ||
          (to > booking.bookedTimeSlots.from &&
            from < booking.bookedTimeSlots.to &&
            booking.approve === 1)
        ) {
          check = true;
          bookingTo = booking.bookedTimeSlots.to;
          bookingFrom = booking.bookedTimeSlots.from;
        }
      });
    }
    if (check) {
      res.send({
        check: true,
        message: `Bạn thất bại. Thời gian bạn đặt đã có người thuê xe!\n${bookingTo} -${bookingFrom}`,
      });
    } else {
      req.body.transactionId = uuidv4();
      const newbooking = new Booking(req.body);
      newbooking.statusPayment = 0;
      await newbooking.save();
      const car = await Car.findOne({ _id: req.body.carid });
      await car.save();
      res.send({
        check: false,
        message: "Bạn đã đặt xe thành công!",
      });
    }
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
router.post("/status-approve", async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.body._id });
    await booking.updateOne({ $set: { approve: 1 } });
    const nameCar = await Car.findById(booking.carid);
    const htmlSend = `Chào bạn! Cảm ơn bạn đã đặt hàng. Đơn hàng đã được phê duyệt! \n Tên xe: ${nameCar.name} \n Thời gian: ${booking.bookedTimeSlots.from} đến ${booking.bookedTimeSlots.to} \n Chúng tôi sẽ liên lạc với bạn để làm thủ tục thuê xe!`;
    const datas = {
      to: "nguyenchinh291298@gmail.com",
      text: "Công ty cho thuê xe auto-movie",
      subject: "Đơn xe của bạn đã được phê duyệt!",
      html: htmlSend,
    };
    await sendMail(datas);
    res.send({
      id: req.body._id,
      status: "success",
      approve: req.body.approve,
    });
  } catch {
    return res.status(400).json(error);
  }
});

router.post("/update-status", async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.body._id });
    let check = false;
    if (req.body.approve === 1) {
      const bookings = await Booking.find({ carid: booking.carid });
      const from = booking.bookedTimeSlots.from;
      const to = booking.bookedTimeSlots.to;
      if (bookings.length > 0) {
        bookings.forEach((booking) => {
          if (
            (from > booking.bookedTimeSlots.from &&
              from < booking.bookedTimeSlots.to &&
              booking.approve === 1) ||
            (to > booking.bookedTimeSlots.from &&
              from < booking.bookedTimeSlots.to &&
              booking.approve === 1)
          ) {
            check = true;
          }
        });
      }
      if (!check) {
        await booking.updateOne({ $set: { approve: req.body.approve } });
        const nameCar = await Car.findById(booking.carid);
        // const mailUser = await User.findById(booking.userid);
        // console.log(mailUser.email);
        const htmlSend = `Chào bạn! Cảm ơn bạn đã đặt hàng. Đơn hàng đã được phê duyệt! \n Tên xe: ${nameCar.name} \n Thời gian: ${booking.bookedTimeSlots.from} đến ${booking.bookedTimeSlots.to} \n Chúng tôi sẽ liên lạc với bạn để làm thủ tục thuê xe!`;
        const datas = {
          to: "nguyenchinh291298@gmail.com",
          text: "Công ty cho thuê xe auto-movie",
          subject: "Đơn xe của bạn đã được phê duyệt!",
          html: htmlSend,
        };
        await sendMail(datas);
      }
    } else {
      await booking.updateOne({ $set: { approve: req.body.approve } });
    }
    res.send({
      id: req.body._id,
      status: "success",
      check,
      approve: check ? booking.approve : req.body.approve,
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
router.get("/data-chart", async (req, res) => {
  try {
    const threeMonthsAgo = moment().subtract(1, "months").startOf("day"); // Tính thời điểm 3 tháng trước

    const result = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(threeMonthsAgo),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          date: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const dateMap = new Map();

    const start = moment(threeMonthsAgo);
    const end = moment().endOf("day");

    while (start.isBefore(end)) {
      const date = start.format("YYYY-MM-DD");
      dateMap.set(date, 0);
      start.add(1, "day");
    }

    for (let i = 0; i < result.length; i++) {
      dateMap.set(result[i].date, result[i].count);
    }

    const response = Array.from(dateMap, ([date, count]) => ({ date, count }));

    res.json(response);
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.get("/total-money", async (req, res) => {
  try {
    const sixMonthsAgo = moment().subtract(6, "months").startOf("month"); // Tính thời điểm 6 tháng trước

    const result = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(sixMonthsAgo),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          totalMoney: { $sum: "$totalMoney" },
        },
      },
      {
        $project: {
          month: "$_id",
          totalMoney: "$totalMoney",
          _id: 0,
        },
      },
    ]);

    const dateMap = new Map();

    const start = moment(sixMonthsAgo).startOf("month");
    const end = moment().startOf("month");

    while (start.isBefore(end)) {
      const month = start.format("YYYY-MM");
      dateMap.set(month, 0);
      start.add(1, "month");
    }

    for (let i = 0; i < result.length; i++) {
      dateMap.set(result[i].month, result[i].totalMoney);
    }

    const response = Array.from(dateMap, ([month, totalMoney]) => ({
      month,
      totalMoney,
    }));

    res.json(response);
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
