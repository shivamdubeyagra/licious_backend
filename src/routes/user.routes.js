const express = require("express");
const UserModel = require("../models/user.model.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
require("dotenv").config();

userRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .send({ message: "This user is already registered. Try to Login." });
    } else {
      const salt = bcryptjs.genSaltSync(10);
      const hashed = bcryptjs.hashSync(password, salt);
      const newUser = new UserModel({ username, email, password: hashed });
      await newUser.save();
      return res
        .status(201)
        .send({ message: "New user has been created registered" });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: " Something went wrong in register route", error });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password." });
    }
    const isMatch = bcryptjs.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid email or password." });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const { password: userPassword, ...userResponse } = user.toObject();
    res
      .status(200)
      .send({ message: "Login successful.", user: userResponse, token });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Something went wrong in the login route.", error });
  }
});

module.exports = userRouter;
