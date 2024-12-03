const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequestModel = require("../model/connectionRequest");
const SAFE_DATA = "firstName lastName photoUrl age gender about skills";
userRouter.get("/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_DATA);
    if (!connectionRequests) {
      return res.json({
        msg: "no connection request found",
      });
    }

    return res.json({
      data: connectionRequests,
      msg: "data fetched successfully",
    });
  } catch (e) {
    return res.json({
      msg: e?.message,
    });
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_DATA)
      .populate("toUserId", SAFE_DATA);
    const data = connectionRequests?.map((request) => {
      if (request.fromUserId._id.toString() == loggedInUser._id.toString()) {
        return request.toUserId;
      }
      return request.fromUserId;
    });
    return res.json({
      data,
    });
  } catch (e) {
    return res.json({
      err: e?.message,
    });
  }
});

userRouter.get("/allConnectionRequests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
      .populate("fromUserId", SAFE_DATA)
      .populate("toUserId", SAFE_DATA);
    return res.json({
      data: connectionRequests,
    });
  } catch (e) {
    return res.json({
      err: e?.message,
    });
  }
});
module.exports = userRouter;
