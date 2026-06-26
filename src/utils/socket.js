const socket = require("socket.io")
const crypto = require("crypto");
const { Chat } = require("../modles/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initilizeSocket = (server) => {
  const io = socket(server, {
    cors : {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " joined Room : " + roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage" , async ({firstName, lastName, userId, targetUserId, text})=>{
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(firstName + " " + text);

          // TODO: Check if userId & targetUserId are friends

          let chat = await Chat.findOne({
            participants : { $all : [userId , targetUserId]},
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
      }
    )

    socket.on("disconnect", ()=>{

    })
  })
}

module.exports = initilizeSocket
