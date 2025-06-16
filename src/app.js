const express = require("express");
const app = express();
const {auth} = require("../middleware/auth");
app.use("/admin", auth);
app.get("/admin/getAllData", (req, res, next) => {
  res.send("all user data");
});
app.get("/admin/deleteone", (req, res, next) => {
  res.send("delet one ");
});
app.listen(7777, () => {
  console.log("Server is successfully started");
});
