const express = require("express");
const app = express();

app.use("/", (req, res, next) => {
  console.log("Dashboard");
 next()
});
app.use("/abc", (req, res, next) => {
  console.log("abc");
  next();
});
app.use("/user", (req, res, next) => {
   console.log("user");
   res.send("user")
 });

app.listen(7777, () => {
  console.log("Server is successfully started");
});
