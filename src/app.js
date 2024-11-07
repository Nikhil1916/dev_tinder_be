const express = require('express');
const app = express();
const { adminAuth } = require("./middlewares/auth");
const { User } = require("./model/user");
const {connectDB} = require("./config/database");


app.use(adminAuth);

app.get("/login",async (req,res)=>{
    const userObj = new User({
        firstName: 'nikhil',
        lastName: 'chawla',
        emailId: 'nc@gmail.com',
        password: 'chawla',
        age: 2,
        gender:'male'
    });
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
})


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