const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getAllUser,
  editUser,
  editPofile,
} = require("../controller/userCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/getall", getAllUser);
router.patch("/edit-user/:id", editUser);
router.post("/edit-profile/", authMiddleware, editPofile);

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
