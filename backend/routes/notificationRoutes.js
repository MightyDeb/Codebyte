import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import { getNotification, updateNotification } from "../controllers/notificationControllers.js";

const app= express.Router()

app.use(isAuthenticated)
app.get('/notification', getNotification)
app.put('/updateNotification', updateNotification)

export default app;