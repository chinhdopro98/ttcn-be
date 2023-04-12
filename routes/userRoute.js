const express = require("express");
const { createUser, loginUserCtrl } = require("../controller/userCtrl");
const router = express.Router();
router.post("/register", createUser);
router.post("/login", loginUserCtrl);

// const User = require("../models/userModel");

// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username, password });
//     if (user) {
//       res.send(user);
//     } else {
//       return res.status(400).json(error);
//     }
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// });

// router.post("/register", async (req, res) => {
//   const { fullname, username, password, email, phone, role } = req.body;
//   try {
//     const newuser = new User(req.body);
//     await newuser.save();
//     res.send(newuser);
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// });

// router.get("/getall", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.send(users);
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// });
// router.post("/edit-user", async (req, res) => {
//   try {
//     const user = await User.findOne({ _id: req.body._id });
//     user.fullname = req.body.fullname;
//     user.username = req.body.username;
//     user.password = req.body.password;
//     user.email = req.body.email;
//     user.phone = req.body.phone;
//     user.role = req.body.role;
//     await user.save();
//     res.send("Update user succesfully");
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// });

// router.post("/delete-user", async (req, res) => {
//   try {
//     await User.findOneAndDelete({ _id: req.body._id });
//     res.send("User delete succesfully");
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// });

// module.exports = router;
module.exports = router;
