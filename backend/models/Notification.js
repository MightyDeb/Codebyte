import mongoose from "mongoose";

const notificationSchema= new mongoose.Schema({
  message:{
    type: String,
    required: true, 
  },
  receivers:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  type:{
    type: String,
    enum: ["contest","friendRequest"],
    required: true
  },
},
{
  timstamps: true,
})

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;