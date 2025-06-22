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
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const logedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: logedInUser._id, status: "accepted" },
        { toUserId: logedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);
    if (!connectionRequest.length) {
      res.send("No user Found");
    }
    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === row.toUserId._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({
      message: "Hey the list of connection",
      data: data,
    });
  } catch (err) {
    res.status(400).send("Error " + err.message);
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
