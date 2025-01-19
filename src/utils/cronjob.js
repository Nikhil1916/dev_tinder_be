const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const ConnectionRequestModel = require("../model/connectionRequest");
cron.schedule('* 8 * * *', async() => {
  try {
    const yesterday = subDays(new Date(),0); 
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    const pendingRequests = await ConnectionRequestModel.find({
        status:"interested",
        createdAt: {
            $gte: yesterdayStart,
            $lte: yesterdayEnd
        }
    }).populate("fromUserId toUserId");
    const listOfEmails = [...new Set(pendingRequests?.map((_)=>_?.toUserId?.emailId))];
    for (const email of listOfEmails) {
        try {
          const res = await sendEmail.run(
            "New Friend Requests pending for " + email,
            "There are so many friend reuests pending, please login to DevxProject.com and accept or reject the requests."
          );
          console.log(res);
        } catch (err) {
          console.log(err);
        }
      }
  } catch(e) {
    console.log(e);
  }
});