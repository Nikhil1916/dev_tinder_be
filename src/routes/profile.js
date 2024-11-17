const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.get("/", userAuth, async (req, res) => {
    try {
      return res.send(req.user);
    } catch (e) {
      return res.status(400).json({
        error: e?.message,
      });
    }
  });

module.exports = {
    profileRouter
}