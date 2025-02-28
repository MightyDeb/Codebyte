import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { connect } from 'mongoose';
import { errorMiddleware } from './middlewares/error.js';
import userRoutes from './routes/userRoutes.js'
import contestRoutes from "./routes/contestRoutes.js"
import dotenv from "dotenv";
import cookieParser from "cookie-parser"

dotenv.config({
  path: './.env'
})
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}
))
app.use(cookieParser())

// MongoDB Connection
connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/user', userRoutes)
app.use('/api/contest', contestRoutes)

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

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});