import React, { useState } from 'react'
import "./Navbar.css"
import Profile from '../Profile/Profile';
import { RiMenu4Fill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import { ChatState } from '../../Context/ChatProvider';
import { FaBell } from "react-icons/fa";
import { getSender } from '../../config/ChatLogic';

const Navbar = (props) => {
  const { user, notification,setNotification, setOpenedChat} = ChatState();
  const [showNoti, setShowNoti] = useState(false);
  console.log(notification)
  return (
    <div className='Navbar'>
      <div className='icon-container'>
        <RiMenu4Fill className='menu-icon' onClick={() => {
          props.setShowContact(e => !e)
          props.setShowSearch(false)
        }} />
        <FaSearch onClick={() => {
          props.setShowSearch(e => !e)
          props.setShowContact(false)
        }} />
      </div>

      <h1>Charcha</h1>
      <div className='nav-right-container'>
        <div className='notification-icon-container' onClick={() => setShowNoti(!showNoti)}>
          <FaBell className='notification-icon' />
          {notification.length ?
            <p className='notification-count'>
              {notification.length}
            </p> : <></>}
          {showNoti &&
            <div className='notification-list'>
              {notification.map((noti) =>
                <p onClick={()=>{
                  setOpenedChat(noti.chat);
                  setNotification(notification.filter(i=>i!==noti));
                }}>{noti.chat.isGroupChat ? `New Message in ${noti.chat.chatName}` : `New Message from ${noti.sender.name}`}
                </p>
              )}
            </div>
          }
        </div>
        <Profile pic={user.pic} logout={props.logout} />
      </div>
    </div>
  )
}

export default Navbar
