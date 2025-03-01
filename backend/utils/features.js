import jwt from "jsonwebtoken"


export const sendToken= (res,user,code,message)=>{
  const token= jwt.sign({_id: user._id}, process.env.JWT_SECRET || 'DENOIRJOI2UJCJOMOI943CKN')
  return res.status(code).cookie("token",token,{
    maxAge: 15*24*60*60*1000, sameSite: 'none', httpOnly: true, secure: true
  }).json({
    success: true, user, message
  })
}

