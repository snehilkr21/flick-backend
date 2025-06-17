const mongoose = require("mongoose");
async function connectDB() {
  return await mongoose.connect(
    "mongodb+srv://snehilkr21:Jo1E33fr7YteWpve@cluster0.ewcfnz0.mongodb.net/Flick"
  );
}
module.exports=connectDB

