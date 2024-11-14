const express = require('express');
const app = express();
const { adminAuth } = require("./middlewares/auth");
const { User } = require("./model/user");
const {connectDB} = require("./config/database");
const {validateSignUpData, validateLoginData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "my_secret";

app.use(adminAuth);

app.use(express.json());
app.use(cookieParser());

app.get("/health",(req,res)=>{
  res.json({
    msg:'healthy server'
  })
})

app.post("/signup",async (req,res)=>{
  try {
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const userObj = new User(
          {
            firstName,
            lastName,
            emailId,
            password: hashedPassword
          }
        );
        const user = await userObj.save();
        return res.json({
            user
        })
    } catch(e) {
        return res.status(422).json({
            err: e?.message,
            msg:'not able to create user'
        })
    }
});

app.post("/login",async(req,res)=>{
  try {
    // console.log(req.body);
    validateLoginData(req);
    const {emailId , password} = req.body;
    const user = await User.findOne({
      emailId
    });



    if(!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(isPasswordValid) {
      // res.cookie("token","okoko");
      const token = await jwt.sign({ _id: user._id }, JWT_SECRET);
      res.cookie("token", token);
      return res.json({
        msg:'User logged in'
      })
    } else {
      throw new Error("Invalid credentials");
    }

  } catch(e) {
    return res.status(400).json({
      error: e?.message
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

app.put("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ['photoUrl', 'about', 'gender', 'age' , 'skills'];
    const isUpdateAllowed = Object.keys(req.body)?.every((k)=>
      ALLOWED_UPDATES.includes(k)
    )
    console.log(isUpdateAllowed);
    if(!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if(data?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
    });
    console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send(err?.message);
  }
});

app.use((err,req,res,next)=>{
  if(err) {
    res.json({
        err
    })
  }
});

app.get("/profile",async(req,res)=>{
  try {
    const cookies = req.cookies;
    console.log(cookies);

    const decodedMsg = jwt.verify(cookies?.token, JWT_SECRET);
    console.log(decodedMsg);
    const { _id } = decodedMsg;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    return res.send(user);
    // return res.json({})
  } catch(e) {
    return res.status(400).json({
      error: e?.message
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