import express from "express";

import { isAuthenticated } from "../middlewares/auth.js";
import { getNotification, updateNotification } from "../controllers/notificationControllers.js";

const app= express.Router()

app.put('/updateNotification', updateNotification)

app.get('/notification', getNotification)


export default app;