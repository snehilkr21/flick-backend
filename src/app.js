const express = require("express");
const app = express();
const connectDB = require("./config/database");
const { findByIdAndUpdate } = require("./modles/user");
const UserModel = require("./modles/user");

app.use(express.json());

connectDB()
  .then(() => {
    console.log("Database connection successfully");
    app.listen(7777, () => {
      console.log("Server is successfully started");
    });
  })
  .catch((err) => {
    console.error("Databse cannot be connected");
  });

app.post("/signup", async (req, res) => {
  // i  am creating a new instance of a user model using the data which we got from the client
  const userObj = new UserModel(req.body);
  try {
    await userObj.save();
    res.send("User added Successfully");
  } catch (err) {
    res.status(400).send("Error while saving the User" + err.message);
  }
});

//to get user of certain on basis of firstName
app.get("/user", async (req, res) => {
  const firstName = req.body.firstName;

  try {
    const data = await UserModel.find({ firstName: firstName });
    if (data.length) res.send(data);
    else res.status(404).send("User not found");
  } catch (err) {
    res.status(400).send("Cannot find User ", err.message);
  }
});

//to get all User
app.get("/feed", async (req, res) => {
  try {
    const data = await UserModel.find({});
    if (data.length) res.send(data);
    else res.status(404).send("Not Found");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//to delete a user
app.delete("/user", async (req, res) => {
  const id = req.body["_id"];
  try {
    const data = await UserModel.findByIdAndDelete({ _id: id });
    if (data) {
      res.send("User delete succesfully");
    } else {
      res.status(400).send("Not Found");
    }
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

//to update the user
app.patch("/user/:id", async (req, res) => {
  const id = req.params?.id;
  const bodyData = req.body;
  const ALLOWED_UPDATE = [
    "photoUrl",
    "about",
    "gender",
    "age",
    "skills",
    "password",
  ];
  try {
    const isUpdatedAllowed = Object.keys(bodyData).every((e) =>
      ALLOWED_UPDATE.includes(e)
    );
    if (!isUpdatedAllowed) {
      throw new Error("Update not allowed");
    }
    const data = await UserModel.findByIdAndUpdate({ _id: id }, bodyData, {
      runValidators: true,
    });

    if (data) {
      res.send("Updated ...");
    } else {
      res.status(400).send("Not Found");
    }
  } catch (err) {
    console.log("err ", err);
    res.status(400).json({ error: err.message });
  }
});
