const jwt = require("jsonwebtoken");
const UserModel = require("../modles/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }
    const decodedObj = await jwt.verify(token, "Flick@123$$");
    const { _id } = decodedObj;
    const user = await UserModel.findOne({ _id });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    //it will add user to req so that what ever the next request handler will get user info
    req.user = user;
    //next is called to move to next request handler
    next();
  } catch (err) {
    res.send("Error :", err.message);
  }
};

module.exports = {
  userAuth,
};
