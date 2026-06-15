const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const {ConnectionRequestModel} = require("../modles/connectionRequest");

console.log("Cron job loaded...",ConnectionRequestModel);
const sendEmail = require("../utils/sentEmail");

cron.schedule("0 25 0 * * *", async () => {
  console.log("Cron triggered:", new Date());

  try {
    const yesterday = subDays(new Date(), 0);

    const startOfYesterday = startOfDay(yesterday);
    const endOfYesterday = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: startOfYesterday,
        $lte: endOfYesterday,
      },
    }).populate("fromUserId toUserId")
    
    const listOfEmail = [ ...new Set(pendingRequests.map((request) => request.toUserId.emailId))];
    console.log("List of Emails to Notify:", listOfEmail);

    console.log("Pending Requests Count:", pendingRequests.length);
    try{
       for(const email of listOfEmail){
        const res = await sendEmail.run(`Yo receive friendRequest from ${email}`);
        console.log("res",res)
      }
    }catch (err){
        console.log(err)
    }
    
  } catch (err) {
    console.error("Error in cron job:", err);
  }
});