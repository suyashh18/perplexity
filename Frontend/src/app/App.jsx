import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { useAuth } from '../features/auth/hook/useAuth'

const App = () => {
  const {handleGetme} = useAuth()
  useEffect(()=>{
    handleGetme()
  },[])
  return (
    
      <RouterProvider router={router}/>

      
      
   
  )
}

export default App
