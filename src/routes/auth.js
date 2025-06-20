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
      throw new Error("Invalid Password");
    } else {
      const token = await user.getJWT();
      //cookiess expire after 8hrs
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successfully");
    }
  } catch (err) {
    res.status(400).send("ERROR! ", err.message);
  }
});

module.exports = {
  authRouter,
};
