const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequestModel = require("../model/connectionRequest");
userRouter.get("/requests/recieved", userAuth, async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName photoUrl age gender about skills")
        // .populate("toUserId");
        // console.log(connectionRequests);
        if(!connectionRequests) {
            return res.json({
                msg:"no connection request found"
            })
        }

        return res.json({
            data:connectionRequests,
            msg:"data fetched successfully"
        })
    } catch(e) {
        return res.json({
            msg: e?.message
        })
    }
});
module.exports = userRouter;