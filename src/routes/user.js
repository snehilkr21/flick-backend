const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { ConnectionRequestModel } = require("../modles/connectionRequest");
const UserModel = require("../modles/user");
//get all the pending request for the login user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const logedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: logedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "about",
      "skills",
    ]);
    console.log("connectionRequest ", connectionRequest);
    if (!connectionRequest.length) {
      res.send("No request found");
    }
    res.json({
      message: " Requests",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

//to get all the users who accepted my request
const dataRequired = [
  "firstName",
  "lastName",
  "photoURL",
  "about",
  "age",
  "gender",
];
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //get the doc with the status "accepted" and loggedin user  id matches either in fromuserId || toUserId
    const connectionList = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", dataRequired)
      .populate("toUserId", dataRequired);

    if (!connectionList) {
      return res.status(404).json({ message: "There is No connection!" });
    }

    //checking whether the user is sender or not.
    //if sender,we give the detail of reciever who recieved the coonection
    //if reciever,we give the detail of sender who send the connection
    const data = connectionList.map((connection) => {
      if (
        connection.fromUserId._id.toString() === loggedInUser._id.toString()
      ) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    res.json({
      message: "Connections fetched successfully!",
      data,
    });
  } catch (err) {
    res.status(400).json({ message: "ERROR: " + err.message });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // User should see all the user cards expect
    //0. his own card
    //1. his connection
    //2. ignored people
    //3. already sent the connection request

    const logedInUser = req.user;

    //find all connection (received + sent)
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: logedInUser._id }, { toUserId: logedInUser._id }],
    }).select(["fromUserId", "toUserId"]);

    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const user = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: logedInUser._id } },
      ],
    })
      .skip(skip)
      .limit(limit);
    res.json({
      data: user,
    });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

module.exports = {
  userRouter,
};
