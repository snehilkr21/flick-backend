const express = require("express");
const app = express();
const { auth } = require("../middleware/auth");
app.use("/", (req, res, next) => {
  if (err) {
    console.log("error found");
  } else {
    console.log("nothing found");
    next(err);
  }
});
app.get("/admin/getAllData", (req, res, next) => {
  try {
    console.log("hello boy");
    res.send("all user data");
  } catch (err) {
    res.send(400).send("400 error occured");
  }
});
app.get("/admin/deleteone", (req, res, next) => {
  res.send("delet one ");
});
app.listen(7777, () => {
  console.log("Server is successfully started");
});
