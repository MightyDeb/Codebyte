import express from "express";
import { createContest, viewPreviousContest, viewUnattemptedContest, fetchContestDetails, sortedParticipants, attemptContest } from "../controllers/contestControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app= express.Router()

app.get('/sortedParticipants/:id', sortedParticipants)
app.get('/unattemptedContests', viewUnattemptedContest)
app.use(isAuthenticated)
app.post('/createContest', createContest)
app.get('/pastContests', viewPreviousContest)
app.put('/attempt/:contestId', attemptContest)
app.get('/details/:id', fetchContestDetails)

export default app;