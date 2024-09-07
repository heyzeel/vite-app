import React, { useState } from 'react'
import "./Profile.css"
import { ChatState } from '../../Context/ChatProvider'
import { RxCross1, RxHeight } from "react-icons/rx";
import { FaAngleDown, FaAngleUp  } from "react-icons/fa";


const Profile = (props) => {
  const [profileMenu, setProfileMenu] = useState(false)
  const [profile, setProfile] = useState(false)
  const {user} = ChatState();

  return (
    <div>
      <div className='profile-container' onClick={() => setProfileMenu(!profileMenu)}>
        <img src={props.pic}></img>
        {profileMenu?<FaAngleUp/>:<FaAngleDown/>}
      </div>
      
        <div className='profile-menu' style={profileMenu ? {opacity:"1"} :{display:'none'}}>
          <p onClick={()=>setProfile(true)}>Show Profile</p>
            <hr/>
          <p onClick={()=>props.logout()}>Logout</p>
        </div>
      {profile&&
        <div className='show-profile'>
          <RxCross1 id='profile-cross' onClick={()=>setProfile(false)}/>
          <img src={user.pic}></img>
          <h2>{user.name}</h2>
        </div>
      }

    </div>
  )
}

export default Profile
