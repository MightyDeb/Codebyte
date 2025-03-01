import Contest from "../models/Contest.js";
import User from "../models/User.js"
import { ErrorHandler } from "../utils/utility.js"



export const createContest= async(req,res,next)=>{ 
  try{
    const {problems,duration}= req.body;
    
    if(!req.userId){
      return next(new ErrorHandler('User unauthorized',401))
    }
    const creator= await User.findById(req.userId)
    if(!creator){
      return next(new ErrorHandler('Wrong user handle',400))
    }
    const updatedCreator = await User.findByIdAndUpdate(
      req.userId,
      { $inc: { contestNumber: 1 } }, 
      { new: true } 
    )
    await Contest.create({
      creator: updatedCreator._id,
      duration,
      problems,
    })
    return res.status(200).json({
      success: "true",
      message: "Contest created successfully"
    })
  } catch (error) {
    next(error)
  } 
}

export const viewPreviousContest= async(req,res,next)=>{
  try {
    if(!req.userId){
      return next(new ErrorHandler('User unauthorized',401))
    }
    const contestList= await Contest.find({ creator: req.userId })
    res.status(200).json({
      success: true,
      contestList
    })
  } catch (error) {
    next(error)
  }
}

export const viewUnattemptedContest= async(req,res,next)=>{
  try {
    const {userId}= req
    const contestList= await Contest.find()
    if(!contestList){
      return next(new ErrorHandler('No contest found',404))
    }
    const unattemptedContests = contestList.filter(contest => {
      const userRegistration = contest.registrations.find(reg => reg.userId.equals(userId));
      if (!userRegistration) return true;
      return userRegistration.problemsSolved.length === 0;
    });
    if(!contestList){
      return next(new ErrorHandler('No contest found',404))
    }
    res.status(200).json({
      success: true,
      unattemptedContests
    })
  } catch (error) {
    next(error)
  }
}

export const attemptContest= async(req,res,next)=>{
  try {
    const {contestId}= req.params
    const {userId}= req
    const contest= await Contest.findById(contestId)
    if(!contest){
      return next(new ErrorHandler('No such contest exists',404))
    }
    const userRegistration = contest.registrations.find(reg => reg.userId.equals(userId));
    if(!userRegistration){
      await Contest.findByIdAndUpdate(contestId, { $push: { registrations: { userId } } })
      return res.status(200).json({
        success: true,
        message: 'Contest attempted'
      })
    }
    return res.status(200).json({
      success: true,
      message: 'Contest already attempted'
    })
  } catch (error) {
    next(error)
  }
}