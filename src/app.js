const express=require("express")
const app= express()
app.use("/test",(req,res)=>{
   res.send("Hello from server")
})
app.use("/",(req,res)=>{
   res.send("Dashboard")
})
app.listen(7777,()=>{
    console.log("Server is successfully started")
})