const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequestModel = require("../model/connectionRequest");
const SAFE_DATA = "firstName lastName photoUrl age gender about skills";
const { User } = require("../model/user");
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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query?.page) || 1;
    let limit = parseInt(req?.query?.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const loggedInUser = req.user;
    const requests = await ConnectionRequestModel.find({
      $or: [
        {
          fromUserId: loggedInUser?._id,
        },
        {
          toUserId: loggedInUser?._id,
        },
      ],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    requests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId?.toString());
      hideUsersFromFeed.add(req.toUserId?.toString());
    });

    const users = await User.find({
      $and: [
        {
          _id: {
            $nin: Array.from(hideUsersFromFeed),
          },
        },
        {
          _id: {
            $ne: loggedInUser?._id,
          },
        },
      ],
    })
      .select(SAFE_DATA)
      .skip(skip)
      .limit(limit)
      .sort({
        $natural: -1,
      });
    return res.json({
      data: users,
    });
  } catch (e) {
    res.status(500).json({
      error: e?.message,
    });
  }
});
module.exports = userRouter;
