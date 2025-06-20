const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error ", err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const logedInUser = req.user;
    Object.keys(req.body).forEach((key) => (logedInUser[key] = req.body[key]));
    await logedInUser.save();
    res.json({
      message: `${logedInUser.firstName} your profile updated`,
      data: logedInUser,
    });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

module.exports = {
  profileRouter,
};
