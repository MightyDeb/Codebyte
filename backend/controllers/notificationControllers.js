import Notification from "../models/Notification.js"

export const getNotification= async (req, res,next)=>{
  try {
    const {userId}= req
    const notifications= await Notification.find
    ({receivers: {$in: userId}}).sort({createdAt: -1})
    
    res.status(200).json({
      success: true,
      notificationMessage: notifications? notifications.map(notification => notification.message) : []
    })
  } catch (error) {
    next  (error)
  }  
}

export const updateNotification= async (req, res,next)=>{
  try {
    const {userId}= req
    await Notification.updateMany(
      {receivers: {$in: userId}},
      { $pull: {receivers: userId} }
    )
    await Notification.deleteMany({
      receivers: { $exists: true, $size: 0 },
    });
    res.status(200).json({
      success: true,
      message: 'Notifications updated'
    })
  } catch (error) {
    next(error)
  }  
}