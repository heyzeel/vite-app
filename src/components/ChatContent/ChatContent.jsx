import React, { useEffect, useState } from 'react'
import "./ChatContent.css"
import { IoMdAdd } from "react-icons/io";
import { ChatState } from '../../Context/ChatProvider';
import { getSender, getSenderImage } from '../../config/ChatLogic';
import CreateGroupBox from '../CreateGroupBox/CreateGroupBox';
import OpenedChatBox from '../OpenedChatBox/OpenedChatBox';


const ChatContent = (props) => {
  const { user, contactList, openedChat, setOpenedChat,notification, setNotification } = ChatState();
  const [createBox, setCreateBox] = useState(false)
  useEffect(()=>{
    if(notification){
      return setNotification(notification.filter(i=>i.chat._id!==openedChat._id))
    }
  },[openedChat])


  return (
    // left side of chatpage
    
    <div className='chat-container' style={{ filter: props.blur ? "blur(5px)" : "blur(0px)" }}>
      <div className='sidebar'  id={
      props.showContact?"show":"not-show"
    } >
        <div className='sidebar-header'>
          <p>My Chats</p>
          <button id='create-group-btn' onClick={() => setCreateBox(true)}><IoMdAdd />Create Group</button>
        </div>
        <div className='contact-list'>
          {contactList.map(chat =>
            <div className='contact-item' onClick={() => {setOpenedChat(chat)     
            props.setShowContact(false)}} style={openedChat === chat ? { backgroundColor: "#00888870" } : { backgroundColor: "#F0F0F0" }} key={chat.name}>

              {<img src={!chat.isGroupChat ? getSenderImage(user, chat) : "https://i.pinimg.com/736x/98/53/c5/9853c5ae293810fc37fb567c8940c303.jpg"}></img>}
              {chat.isGroupChat ? chat.chatName : getSender(user, chat.users)}

            </div>
          )}
        </div>
      </div>

      {/* Right side of Chat page */}
      <div className='ChatBox-container'>
        {openedChat ?
            <OpenedChatBox/>
          :<h2>Click On Contact To Open Chat</h2>
        }
      </div>
      {createBox && <CreateGroupBox setCreateBox={setCreateBox} />}
    </div>
  )
}

export default ChatContent
