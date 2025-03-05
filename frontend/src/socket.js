
import { createContext, useContext, useMemo } from 'react'
import io from 'socket.io-client'

const SocketContent= createContext()
const GetSocket= ()=> useContext(SocketContent)

const SocketProvider= ({children})=>{
  const socket=  useMemo(()=> 
    io('https://codebyte-if2s.onrender.com', {withCredentials: true}) 
  ,[])
  return(
    <SocketContent.Provider value={socket}>
      {children}
    </SocketContent.Provider>
  )
}

export {GetSocket,SocketProvider}


