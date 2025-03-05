import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { connect } from 'mongoose';
import { errorMiddleware } from './middlewares/error.js';
import userRoutes from './routes/userRoutes.js'
import contestRoutes from "./routes/contestRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import {Server} from "socket.io"
import Notification from './models/Notification.js';
import User from './models/User.js';
import { ErrorHandler } from './utils/utility.js';



dotenv.config({
  path: './.env'
})
const app = express();
const PORT = process.env.PORT || 5000;


const io = new Server({
  cors:{
    origin: "*",
  }
})
app.set("io", io)


const onlineUsers = new Map();
// const addNewUser = (username,socketId) => {
//   !onlineUsers.some(user => user.username === username) && onlineUsers.push({username,socketId})
// }
// const deleteUser = (socketId) => {
//   onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
// }

// const getUser = (username) => {
//   console.log(onlineUsers)
//   return onlineUsers.find(user => user.username === username) 
// }

io.on("connection", (socket) => {
  //console.log("New Connection")
  socket.on('userOnline', (username) => {
    onlineUsers.set(username, socket.id); // Add user to the online users list
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
  })
  socket.on("newContest", async({username, problems, duration}) => {
    try {
      const userIds= await User.find({}, { _id: 1 })
      await Notification.create({
      message: `${username} has created a new contest of ${duration} minutes.`,
      receivers: userIds.map(user => user._id),
      type: "contest"
    })
    io.emit("getContestAlert", {message: `${username} has created a new contest of ${duration} minutes.`,type: "contest"})
    } catch (error) {
      console.log(error)
    }   
  })
  socket.on("friendRequest", async({sender, receiver}) => {
    try {
      if(receiver!==sender){
        const friendId= await User.findOne({username: receiver})
        await Notification.create({
          message: `${sender} has sent you a friend request.`,
          receivers: [friendId._id],
          type: "friendRequest"
         })
        io.to(onlineUsers.get(receiver)).emit("newfriendRequestAlert", {message: `${sender} has sent you a friend request.`,type: "friendRequest"})
      }
    } catch (error) {
      console.log(error)
    }
  })
  //io.emit("contestCreated", "Contest Created")
  socket.on("disconnect", () => {
    for (const [username, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(username); // Remove user from the online users list
        io.emit('onlineUsers', Array.from(onlineUsers.keys())); // Emit updated list of online users
        break;
      }
    }
    console.log('A user disconnected:', socket.id);
  })
})

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE']
}
))
app.use(cookieParser())

// MongoDB Connection
connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/user', userRoutes)
app.use('/api/contest', contestRoutes)
app.use('/api/notifications', notificationRoutes)

// Routes
app.get('/', (req, res) => {
  res.send('Competitive Programming Arena Backend');
});



//leaderboard
app.get("/api/leaderboard", async (req, res) => {
  try {
    const response = await axios.get(
      "https://codeforces.com/api/user.ratedList?activeOnly=true"
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});



app.use(errorMiddleware)

io.listen(8000)
// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

