const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/requests");
const { userRouter } = require("./routes/user");
const  paymentRouter  = require("./routes/payment");
const chatRouter = require("./routes/chat.js")

const initilizeSocket = require("./utils/socket.js")


var cors = require("cors");
const http = require("http");
require('dotenv').config()

require("./utils/cronjob.js")

app.use(
  cors({
    origin: "http://localhost:5173", // Allow only a specific origin
    credentials: true, // Enable cookies and credentials
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/",chatRouter)

const server = http.createServer(app)
initilizeSocket(server)

connectDB()
  .then(() => {
    console.log("Database connection successfully");
    server.listen(7777, () => {
      console.log("Server is successfully started");
    });
  })
  .catch((err) => {
    console.error("Databse cannot be connected");
  });
