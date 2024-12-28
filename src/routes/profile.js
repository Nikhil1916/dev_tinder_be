const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const { editProfileSchema } = require("../utils/types");
const profileRouter = express.Router();


profileRouter.use(userAuth);
profileRouter.get("/view", async (req, res) => {
  try {
    return res.send(req.user);
  } catch (e) {
    return res.status(400).json({
      error: e?.message,
    });
  }
});


profileRouter.put("/edit",async (req,res)=>{
  try {
    const isInputValid = editProfileSchema.safeParse(req.body);
    if(!isInputValid.success) {
      return res.status(400).json({
        error:isInputValid?.error?.issues?.[0]?.path?.[0]+" is "+ isInputValid?.error?.issues?.[0]?.message
      })
    }
    validateEditProfileData(req);
    const loggedInUser = req.user;
    Object.keys(req.body)?.forEach(key=>loggedInUser[key] = req.body[key]);

    await loggedInUser.save();
    res.json({
      msg:`${loggedInUser._id} data updated`,
      data: loggedInUser
    })
  } catch(e) {
    res.status(400).json({
      err:'unable to update user '+e?.message
    })
  }

});


module.exports = {
  profileRouter,
};
