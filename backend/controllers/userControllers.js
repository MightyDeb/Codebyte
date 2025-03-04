import axios from "axios"
import User from "../models/User.js"
import { sendToken } from "../utils/features.js"
import { compare } from "bcryptjs"
import { ErrorHandler } from "../utils/utility.js"

export const register= async(req,res,next)=>{
  try {
    const {name,email,username,password}= req.body
    if(!name || !username || !password){
      return next(new ErrorHandler('Fill in all details',400))
    }
    const user= await User.findOne({username})
    if(user){
      return next(new ErrorHandler('Username alreasy exists',400))
    }
    const cfVerifier= await axios.get(`https://codeforces.com/api/user.info?handles=${username}`)
    if(!cfVerifier){
      return next(new ErrorHandler('No such username exists in codeforces',400))
    }
    if(password.length < 6){
      return next(new ErrorHandler('Password is atleast of 6 characters',400))
    }
    const newUser= await User.create({
      name,email,username,password,
      profileAvatar: cfVerifier.data.result[0].avatar,     
    })
    sendToken(res,newUser,201,"User created successfully")
  } catch (error) {
    next(error)
  }
}

//login user and save token in cookie
export const login= async(req,res,next)=>{
  try {
    const {email,username,password}= req.body
    if((!email && !username) || !password){
      return next(new ErrorHandler('Fill in all details',400))
    }
    const user= await User.findOne({username}).select("+password")
    if(!user){
      return next(new ErrorHandler('Username does not exist',404))
    }
    const isMatch= await compare(password, user.password)
    if(!isMatch){
      return next(new ErrorHandler('Invalid credentials',404))
    }
    sendToken(res,user,200,`Welcome Back ${user.name}`)
  } catch (error) {
    next(error)
  } 
}

export const logout= (req,res,next)=>{
  return res.status(200).cookie("token","",{
    maxAge: 0, sameSite: 'none', httpOnly: true, secure: true}).json({
    success: true,
    message: 'Logged out successfully'
  })
}

export const getMyProfile= async(req,res,next)=>{
  try {
    const user= await User.findById(req.userId)
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    next(error)
  } 
}

export const addFriend= async(req,res,next)=>{
  try {
    const {friendUsername}= req.body
    if(!friendUsername){
      return next(new ErrorHandler('No friend username exists',400))
    }
    if(friendUsername===req.userId){
      return next(new ErrorHandler('You cannot friend yourself',400))
    }
    const friend= await User.findOne({ username: friendUsername })
    if(!friend){
      return next(new ErrorHandler('No such user exists',400))
    }
    const user= await User.findByIdAndUpdate(req.userId, { $push: { friends:  friend.username} },
      { new: true })
    res.status(200).json({
      success: true,
      message: "Friend Added"
    })
  } catch (error) {
    next(error)
  }
}

export const getUserData= async(req,res,next)=>{
  try {
    
    const {username} = req.params
    
    if(!username){
      return next(new ErrorHandler('No userID attached',400))
    }
    const user= await User.findOne({username})
    
    if(!user){
      return next(new ErrorHandler('No such user exists',400))
    }
    const {data} = await axios.get(
      `https://codeforces.com/api/user.info?handles=${username}`
    );
    const fetchedData= data.result[0]
    res.status(200).json({
      success: true,
      details:{
        name: user.name,
        username: username,
        CFrating:  fetchedData.rating,
        rank: fetchedData.rank,         
      }
    })
  } catch (error) {
    next(error)
  }  
}

export const getDetailsViaId= async(req,res,next)=>{
  try{
    const {id}= req.params
    if(!id){
      return next(new ErrorHandler('No ID entered',400))
    }
    const user= await User.findById(id)
    if(!user){
      return next(new ErrorHandler('No such user exists',400))
    }
    return res.status(200).json({
      success: true,
      "name": user.name,
      "username": user.username
    })
  } catch(error){
    next(error)
  }
}