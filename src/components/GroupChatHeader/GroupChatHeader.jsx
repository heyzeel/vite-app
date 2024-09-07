import React, { useState } from 'react'
import "./GroupChatHeader.css"
import { ChatState } from '../../Context/ChatProvider'
import { FaEdit } from "react-icons/fa";
import EditGroupChat from '../EditGroupChat/EditGroupChat';

const GroupChatHeader = () => {
    const {openedChat} = ChatState();
    const [showEditGroup, setShowEditGroup] = useState(false);

  return (
    <div className='ChatBox-header'>
        <h2>{openedChat.chatName}</h2>
        <FaEdit id='groupEdit-btn' onClick={()=>setShowEditGroup(true)}/>
        {showEditGroup&&<EditGroupChat setShowEditGroup={setShowEditGroup}/>}
    </div>
  )
}

export default GroupChatHeader