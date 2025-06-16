const express = require("express");
const app = express();

app.get("/abc/:userId/:name", [
  (req, res, next) => {
    console.log("First route handler");
    //  res.send(`Response !!`);
    next();
  },
  (req, res, next) => {
    console.log("second route handler");
    next();
    //  res.send("2nd response");
  },
  (req, res, next) => {
    console.log("third route handler");
    res.send("3nd response");
  },
]);

app.listen(7777, () => {
  console.log("Server is successfully started");
});
