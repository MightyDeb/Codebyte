import jwt from "jsonwebtoken"
import { ErrorHandler } from "../utils/utility.js"

export const isAuthenticated=(req,res,next)=>{
  try {
    const token= req.cookies.token
    console.log(token)
    if(!token){
      return next(new ErrorHandler('Please login to access the route', 401))
    }
    const decodedData= jwt.verify(token, process.env.JWT_SECRET || 'DENOIRJOI2UJCJOMOI943CKN')
    req.userId= decodedData._id;
    next()
  } catch (error) {
    next(error)
  }
}