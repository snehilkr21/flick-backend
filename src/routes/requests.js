const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { ConnectionRequestModel } = require("../modles/connectionRequest");
const UserModel = require("../modles/user");
const mongoose = require("mongoose");
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status types");
      }
      // Check if it's a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        throw new Error("Invalid user ID format");
      }
      //if my toUserId exist in DB or not
      const toUserIdExist = await UserModel.findById(toUserId);

      if (!toUserIdExist) {
        throw new Error("User not found");
      }

      //if the connection is made between A to B or B to A (B cannnot send connection A if A already send it)
      const existingConnectRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectRequest) {
        throw new Error("Connection is already establish");
      }

      const connectionRequest = await new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: `${req.user.firstName} is ${status} in ${toUserIdExist.firstName}`,
      });
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const logedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Status not allowed");
      }

      //here we are restricting that if status is rejectd then we donot change it
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: logedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        throw new Error("Connection request not find");
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.send("Connection request send successfully");
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  }
);
module.exports = {
  requestRouter,
};
