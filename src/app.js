const express = require("express");
const app = express();
const connectDB=require("./config/database")
const UserModel= require("./modles/user")

app.use(express.json())

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
  // i  am creating a new instance of a user model using the data which we got from the client
  const userObj= new UserModel(req.body)
  try{
    await userObj.save()
    res.send("User added Successfully")
  }catch(err){
    res.send(400).send("Error while saving the User" + err.message)
  }
 
})
