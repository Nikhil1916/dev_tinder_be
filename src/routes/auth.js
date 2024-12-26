const express = require("express");
const authRouter = express.Router();
const { User } = require("../model/user");
const {
  validateSignUpData,
  validateLoginData,
} = require("../utils/validation");
const bcrypt = require("bcrypt");
const { signUpSchema, loginSchema } = require("../utils/types");
const SAFE_DATA = "firstName lastName photoUrl age gender about skills emailId _id";

authRouter.post("/signup", async (req, res) => {
  try {
    const isInputValid = signUpSchema.safeParse(req.body);
    if(!isInputValid.success) {
      return res.status(400).json({
        error:isInputValid?.error?.issues?.[0]?.path?.[0]+" is "+ isInputValid?.error?.issues?.[0]?.message
      })
    }
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
    const isInputValid = loginSchema.safeParse(req.body);
    if(!isInputValid.success) {
      return res.status(400).json({
        error:isInputValid?.error?.issues?.[0]?.path?.[0]+" is "+ isInputValid?.error?.issues?.[0]?.message
      })
    }
    validateLoginData(req);
    const { emailId, password } = req.body;
    const user = await User.findOne({
      emailId,
    });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJwt();
      res.cookie("token", token);
      const userD = user?.toJSON();
      delete userD.password;
      return res.json({
        msg: "User logged in",
        user: userD
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

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(),
  });
  res.send("logout successful");
});

module.exports = {
  authRouter,
};
