const jwt = require('jsonwebtoken');
const { User } = require('../model/user');

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
  userAuth
};
