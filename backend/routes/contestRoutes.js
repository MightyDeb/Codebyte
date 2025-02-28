import express from "express";
import { createContest, viewPreviousContest } from "../controllers/contestControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app= express.Router()

app.use(isAuthenticated)
app.post('/createContest', createContest)
app.get('/pastContests', viewPreviousContest)

export default app;