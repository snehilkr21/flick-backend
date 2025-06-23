const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const UserModel = require("../modles/user");
const { validateSignUpData } = require("../utils/validation");

//sign-up
authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  try {
    validateSignUpData(req);
    const hasedPassword = await bcrypt.hash(password, 10);
    const userObj = new UserModel({
      firstName,
      lastName,
      emailId,
      password: hasedPassword,
    });
    await userObj.save();
    res.send("User added Successfully");
  } catch (err) {
    res.status(400).send("Error while saving the User" + err.message);
  }
});

//login
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await UserModel.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credinitials");
    }
    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    } else {
      const token = await user.getJWT();
      //cookiess expire after 8hrs
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.json({
        data: user,
        message: "Login Succesfully",
      });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("You are logged out");
});
module.exports = {
  authRouter,
};
