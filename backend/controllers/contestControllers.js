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
    const {penalty,problemsSolved}= req.body
    console.log(penalty,problemsSolved)
    const {contestId}= req.params
    const {userId}= req
    const contest= await Contest.findById(contestId)
    if(!contest){
      return next(new ErrorHandler('No such contest exists',404))
    }
    const {username}= await User.findById(userId)
    const userRegistration = contest.registrations.find(reg => reg.userId.equals(userId));
    if(userRegistration){
      return next(new ErrorHandler('Contest already attempted',404))
    }
    
      await Contest.findByIdAndUpdate(contestId, { $push: { registrations: { 
        userId,username,
        penalty: penalty,
        problemsSolved: problemsSolved,
        
      } } })
      return res.status(200).json({
        success: true,
        message: 'Contest attempted'
      })
    
  } catch (error) {
    next(error)
  }
}

export const fetchContestDetails= async(req,res,next)=>{
  const {id}= req.params
  try {
    const contest= await Contest.findById(id)
    if(!contest){
      return next(new ErrorHandler('No such contest exists',404))
    }
    res.status(200).json({
      success: true,
      contest
    })
  } catch (error) {
    next(error)
  } 
}

export const sortedParticipants= async(req,res,next)=>{
  try {
    const {id}= req.params
    const contest= await Contest.findById(id)
    if(!contest){
      return next(new ErrorHandler('No such contest exists',404))
    }
    const sortedParticipants = contest.registrations?.sort((a, b) => {
      if (b.problemsSolved !== a.problemsSolved) {
        return b.problemsSolved - a.problemsSolved;
      } else {
        return a.penalty - b.penalty;
      }
    });
    if(sortedParticipants.length===0){
      return res.status(200).json({
        success: false,
        message: "No participants"
      })
    }
    
    return res.status(200).json({
      success: true,
      sortedParticipants,
      
    })
  } catch (error) {
    console.log(error)
  } 
}