const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model.js");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Authentication required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({
      _id: decoded._id,
    });
    if (!user) {
      throw new Error("login user not able access for middle ware");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: "Authentication required" });
  }
};

module.exports = authMiddleware;
