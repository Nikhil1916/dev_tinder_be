
const express = require("express");
const authRouter = express.Router();
const {User} = require("../model/user");
const { validateSignUpData, validateLoginData } = require("../utils/validation");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "my_secret";
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userObj = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });
    const user = await userObj.save();
    return res.json({
      user,
    });
  } catch (e) {
    return res.status(422).json({
      err: e?.message,
      msg: "not able to create user",
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    // console.log(req.body);
    validateLoginData(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({
      emailId,
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }
    console.log("user",user);
    const isPasswordValid = user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJwt();
      res.cookie("token", token);
      return res.json({
        msg: "User logged in",
      });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (e) {
    return res.status(400).json({
      error: e?.message,
    });
  }
});

module.exports = {
  authRouter,
};
