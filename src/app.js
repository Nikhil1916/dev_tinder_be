const express = require('express');
const app = express();
const { adminAuth } = require("./middlewares/auth");
const { User } = require("./model/user");
const {connectDB} = require("./config/database");


app.use(adminAuth);

app.use(express.json());

app.get("/health",(req,res)=>{
  res.json({
    msg:'healthy server'
  })
})

app.post("/login",async (req,res)=>{
  console.log("done");
    const userObj = new User(req.body);
    try {
        const user = await userObj.save();
        return res.json({
            user
        })
    } catch(e) {
        return res.status(422).json({
            e,
            msg:'not able to create user'
        })
    }
});


app.get("/user",async(req,res)=>{
  const {emailId} = req.body;
  console.log(emailId);
  try {
    const user = await User.findOne({emailId:emailId});
    if(user) {
      return res.json({
        user
      })
    } else {
      return res.json({
        msg:'user not found'
      })
    }
  } catch(e) {
    return res.status(400).json({
      msg:'user not found'
    })
  }
});


app.delete("/user",async(req,res)=>{
  const {_id} = req.body;
  // console.log(emailId);
  try {
    const user = await User.findOneAndDelete({_id});
    if(user) {
      return res.json({
        user,
        msg:'user deleted'
      })
    } else {
      return res.json({
        msg:'user not found'
      })
    }
  } catch(e) {
    return res.status(400).json({
      msg:'user not found'
    })
  }
});


app.get("/feed",async(req,res)=>{
  try {
    const users = await User.find();
    if(users.length) {
      return res.json({
        users
      })
    } else {
      return res.json({
        msg:'users not found'
      })
    }
  } catch(e) {
    return res.status(400).json({
      msg:'users not found'
    })
  }
});

app.put("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
    });
    console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong ");
  }
});

app.use((err,req,res,next)=>{
  if(err) {
    res.json({
        err
    })
  }
})

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