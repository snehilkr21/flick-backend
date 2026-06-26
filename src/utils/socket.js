const socket = require("socket.io")
const crypto = require("crypto");
const { Chat } = require("../modles/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initilizeSocket = (server) =>{
    const io = socket(server, {
      cors : {
        origin : "http://localhost:5173"
      }
    })
    
    //this is place where we receive the connection from client end
    io.on("connection" , (socket) =>{
      //handle event
      socket.on("joinChat" , ({firstName, userId, targetUserId})=>{
         const roomId = getSecretRoomId(userId, targetUserId);
         socket.join(roomId)
      });
      socket.on("sendMessage" , async ({firstName, lastName, userId, targetUserId, text})=>{
        const roomId = getSecretRoomId(userId, targetUserId);
        try {
          let chat = await Chat.findOne({
            participants : { $all : [userId , targetUserId]}
          })
          if(!chat) {
             chat = new Chat({
                participants : [ userId, targetUserId ],
                message : []
            })
          } 
          chat.message.push({
            senderId : userId,
            text
          })
          await chat.save()
          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
        } catch (err) {
         console.log("err ",err)
        }

      })
      socket.on("disconnect", ()=>{

      })
    })
}

module.exports = initilizeSocket
