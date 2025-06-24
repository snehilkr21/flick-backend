const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const UserModel = require("../modles/user");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
var validator = require("validator");

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
    let updateData = await UserModel.findByIdAndUpdate(
      { _id: logedInUser._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.json({
      message: `${logedInUser.firstName} your profile updated`,
      data: updateData,
    });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Enter a strong password");
    }

    const bcryptNewPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.findByIdAndUpdate(
      { _id: req.user._id },
      { password: bcryptNewPassword },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json({
      message: `Hey your password is updated`,
    });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

module.exports = {
  profileRouter,
};
