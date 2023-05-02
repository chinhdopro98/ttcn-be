const User = require("../models/userModel");
const { generateToken } = require("../config/jwtToken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const createUser = asyncHandler(async (req, res) => {
  try {
    const { username } = req.body;
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }
    const newUser = await User.create(req.body);
    res.status(201).json({
      _id: newUser?._id,
      username: newUser?.username,
      firstname: newUser?.firstname,
      lastname: newUser?.lastname,
      email: newUser?.email,
      phone: newUser?.phone,
      role: newUser?.role,
      token: generateToken(newUser?._id),
    });
  } catch (error) {
    // Handle error
    res.status(400).json({ error: error.message });
  }
});
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    return res.status(400).json(error);
  }
});
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const findUser = await User.findOne({ username });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    // const refreshToken = await generateRefreshToken(findUser?._id);
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   maxAge: 3 * 24 * 60 * 60 * 1000,
    // });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      username: findUser?.username,
      email: findUser?.email,
      role: findUser?.role,
      phone: findUser?.phone,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});
const editUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingUser = await User.findOne({
    username: req.body.username,
    _id: { $ne: id },
  });
  if (existingUser) {
    return res.status(400).json({ error: "Username already exists" });
  }
  try {
    const user = await User.findById(id);
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.username = req.body.username;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.tax = +req.body?.tax;
    user.nameCustomer = req.body?.nameCustomer;
    user.role =
      req.body.role === 0 ? "admin" : req.body.role === 1 ? "owner" : "user";
    const updateUser = await user.save();
    res.send({ updateUser, status: "success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = {
  editUser,
  createUser,
  loginUserCtrl,
  getAllUser,
};
