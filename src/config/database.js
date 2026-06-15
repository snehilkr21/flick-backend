const mongoose = require("mongoose");
async function connectDB() {
  return await mongoose.connect(process.env.DB_CONNECTION_SECRET);
}
module.exports=connectDB

