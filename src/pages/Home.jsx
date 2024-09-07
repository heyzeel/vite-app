import React, { useEffect, useState } from 'react'
import SignUp from './SignUp'
import Login from './Login'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate()
  const [state, setState] = useState(false)
  
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('userInfo')) 
    console.log(user)
    if(user) {navigate("/chat")}
  },[navigate])
  return (
    <div className='home'>
      {state?<SignUp setState={setState}/>:<Login setState={setState}/>}
    </div>
  )
}

export default Home
