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
      mobile: newUser?.mobile,
      token: generateToken(newUser?._id),
    });
  } catch (error) {
    // Handle error
    res.status(400).json({ error: error.message });
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
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});
module.exports = {
  createUser,
  loginUserCtrl,
};
