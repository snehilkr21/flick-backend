const express = require("express");
const app = express();
const connectDB=require("./config/database")
const UserModel= require("./modles/user")
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
app.post("/signup", async (req,res)=>{
  const userObj= new UserModel({
    firstName:"rahul",
    lastName:"kumar",
    gender:"Male",
    password:"rahul@123",
    emailid:"rahul@gmail.com"
  })
  try{
    await userObj.save()
    res.send("User added Successfully")
  }catch(err){
    res.send(400).send("Error while saving the User" + err.message)
  }
 
})
