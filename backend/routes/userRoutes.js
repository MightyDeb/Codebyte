import express from "express";
import { addFriend, getMyProfile, getUserData, login, logout, register } from "../controllers/userControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app= express.Router()

app.post('/register', register)
app.post('/login', login)

app.use(isAuthenticated)
app.get('/me',getMyProfile)
app.get('/logout', logout)
app.put('/addFriend', addFriend)
app.get('getProfile/:userId',getUserData)

export default app;