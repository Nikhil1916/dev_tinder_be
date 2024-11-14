// const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { User } = require('../model/user');
const adminAuth = (req, res, next) => {
  const token = "xyz";
  if (token == "xyz") {
    next();
  } else {
    return res.status(401).send("token is wrong");
  }
};

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token");
    }

    const decodedObj = await jwt.verify(token, "my_secret");
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  adminAuth,
  userAuth
};
