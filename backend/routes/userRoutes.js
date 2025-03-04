import express from "express";
import { addFriend, getDetailsViaId, getMyProfile, getUserData, login, logout, register } from "../controllers/userControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app= express.Router()

app.post('/register', register)
app.post('/login', login)
app.get('/getDetails/:id', getDetailsViaId)
app.get('/get/:username',getUserData)
app.use(isAuthenticated)

app.get('/me',getMyProfile)
app.get('/logout', logout)
app.put('/addFriend', addFriend)
 


export default app;