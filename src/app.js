const express = require("express");
const app = express();

app.get("/abc", (req, res) => {
  console.log(req.query);
  res.send(`hello`);
});

app.listen(7777, () => {
  console.log("Server is successfully started");
});
