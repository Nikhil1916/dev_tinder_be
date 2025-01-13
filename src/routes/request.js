const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const { User } = require("../model/user");
const sendEmail = require("../utils/sendEmail");
requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const fromUserId = user?._id;
    const {toUserId, status} = req.params;
    const toUser = await User.findById(toUserId);
    if(!toUser) {
      return res.status(404).json({ message: "User not found!" });
    }
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or:[
        { fromUserId, toUserId },
        {
          fromUserId: toUserId,
          toUser: fromUserId
        }
      ]
    });

    if(existingConnectionRequest) {
      return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    });

    await connectionRequest.save(); 
    // const emailRes = await sendEmail.run(
    //   "A new friend request from " + req.user.firstName,
    //   req.user.firstName + " is " + status + " in your profile",
    //   "nikhilchawla9013@gmail.com" 
    // );
    // console.log(emailRes);
    res.send(user.firstName + " sent the connect request! to "+ toUser.firstName);
  } catch(e) {
    console.log(e);
    console.log(e.stack);
    res.status(404).send("Error "+ e?.message);
  }
});


requestRouter.post("/review/:status/:requestId",userAuth,async(req,res)=>{
  try {
    const loggedInUser = req.user;
    const allowedStatus = ["accepted","rejected"];
    const {status, requestId} = req.params;
    if(!allowedStatus.includes(status)) {
      throw Error("status not valid");
    }
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      status: "interested",
      toUserId: loggedInUser._id
    });
    if(!connectionRequest) {
      throw Error("Connection request not found");
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.json({
      msg: "connection request "+ status,
      data
    })
  } catch(e) {
    res.status(400).json({
      error: e?.message
    })
  }
})
module.exports = requestRouter;