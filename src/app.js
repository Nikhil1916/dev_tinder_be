// todo: add input validation for all body data
//create new application with typescript

const express = require("express");
const app = express();
const cors = require("cors");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed HTTP methods
  credentials: true, // Allow credentials if needed
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({
    msg: "healthy server",
  });
});
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user",userRouter);
app.use((err, req, res, next) => {
  console.log(err);
  if (err) {
    res.json({
      err,
    });
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
