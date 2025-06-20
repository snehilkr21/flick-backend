const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  res.send(req.firstName + " send the connect request");
});

module.exports = {
  requestRouter,
};
