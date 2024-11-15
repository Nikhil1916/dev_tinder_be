const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");
const { User } = require("./model/user");
const { connectDB } = require("./config/database");
const { validateSignUpData, validateLoginData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "my_secret";

app.use(adminAuth);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({
    msg: "healthy server",
  });
});

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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
    // const isPasswordValid = await bcrypt.compare(password, user.password);
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    return res.send(req.user);
  } catch (e) {
    return res.status(400).json({
      error: e?.message,
    });
  }
});

app.use((err, req, res, next) => {
  if (err) {
    res.json({
      err,
    });
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
