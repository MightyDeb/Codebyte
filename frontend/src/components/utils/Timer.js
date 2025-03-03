import { useState, useEffect } from "react"
import React from 'react'

const Timer = ({duration=0}) => {
  const [time,setTime]= useState(duration)
  useEffect(()=>{
    setTimeout(()=>{
      setTime(time-1000)
    },1000)
  },[time])
}

export default Timer