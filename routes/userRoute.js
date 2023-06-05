const express = require("express");
const {
  createUser,
  loginUserCtrl,
  getAllUser,
  editUser,
  editPofile,
  deleteUser,
} = require("../controller/userCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/getall", getAllUser);
router.patch("/edit-user/:id", editUser);
router.post("/edit-profile/", authMiddleware, editPofile);
router.post("/delete-user", deleteUser);

module.exports = router;
