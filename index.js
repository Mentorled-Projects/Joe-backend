const express = require ("express");
const mongoose = require ("mongoose");
const connectToDatabase = require ('./src/config.js');
const cors = require ("cors");
const dotenv = require ("dotenv");
const http = require ("http");
const socketIo = require ('socket.io');
const Message = require ('./models/message.js');
const Notification = require ('./models/Notifications.js');
const { swaggerUi, swaggerSpec }= require ('./src/swagger.js')
// const fs = require('fs');


dotenv.config();

const app = express();

// const options = {
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// };

const server = http.createServer( app);


app.use (express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "https://joe-frontend-three.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

const io = socketIo(server, {
    cors: {
          origin: ["https://joe-frontend-three.vercel.app"],
          methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

    }
});

io.on("connection", (socket) => {
    console.log("New user connected:", socket.id)


socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle incoming messages
  socket.on("sendMessage", async (data) => {
    const message = await Message.create(data); 

    // Send message to the receiver's room
    io.to(data.receiver).emit("newMessage", message);

    const notification = await Notification.create({
  user: data.receiver,
  userModel: data.receiverModel,
  type: "message",
  message: `${data.senderModel} sent you a message`,
  data: { sender: data.sender },
});

io.to(data.receiver).emit("newNotification", notification);

  });

  
  
socket.on("markAsRead", async ({ sender, receiver }) => {
  try {
    const senderId = new mongoose.Types.ObjectId(sender);
    const receiverId = new mongoose.Types.ObjectId(receiver);

    await Message.updateMany(
      { sender: senderId, receiver: receiverId, seen: false },
      { $set: { seen: true, seenAt: new Date() } }
    );

    io.to(sender).emit("messagesRead", { by: receiver });
  } catch (err) {
    console.error(" Error marking messages as read:", err.message);
  }
});
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});




app.use ('/api/v1/auth', require ('./routes/auth'));
app.use ('/api/v1/users', require ('./routes/users'));
app.use ('/api/v1/guardian', require ('./routes/guardian'))
app.use ('/api/v1/tutor', require ('./routes/tutor'))
app.use ('/api/v1/child', require ('./routes/child'))
app.use ('/api/v1/upload', require ('./routes/upload'))
app.use ('/api/v1/message', require ('./routes/message'))
app.use ('/api/v1/post', require ('./routes/post'))


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



const Port = 3000

server.listen (Port, () => {
   console.log(`Server is up and running on port ${Port}`)
} )

connectToDatabase()

