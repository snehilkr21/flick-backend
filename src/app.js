const express = require("express");
const app = express();

//this will handle only get method
app.get("/hello", (req, res) => {
  res.send("hello get");
});

app.get("/user", (req, res) => {
  res.send({ firstName: "snehil", lastName: "kumar" });
});

app.post("/user", (req, res) => {
  res.send("data succesfully saved");
});
//this will matchall the http method API call to /hello
app.use("/hello", (req, res) => {
  res.send("hello all");
});

app.listen(7777, () => {
  console.log("Server is successfully started");
});
