import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import ChatContent from '../components/ChatContent/ChatContent'
import { useNavigate } from 'react-router-dom'
import SearchUser from '../components/SearchUser/SearchUser'
import axios from 'axios'
import { ChatState } from '../Context/ChatProvider'

const Chat = () => {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("userInfo");
    navigate("/")
  }

  const { user, setContactList, openedChat,setOpenedChat, loading, fetchAgain, notification, setNotification} = ChatState();

  const [searchedUsers, setSearchedUser] = useState();
  const [showContact, setShowContact] = useState(true)
  const [showSearch, setShowSearch] = useState(false);
  const [chatLoading, setChatLoading] = useState(true)

  const accessChat = async (userId) => {
    setChatLoading(true)
    const accessedChat = await axios.post("http://localhost:5000/api/chat", { userId }, {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`
      }
    });
    setOpenedChat(accessedChat)
    setShowSearch(false)
    setSearchedUser()
    setChatLoading(false)
  }

  const fetchChat = async () => {
    const { data } = await axios.get("http://localhost:5000/api/chat", {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })
    setContactList(data)
    setChatLoading(false)
  }

  useEffect(() => {
    fetchChat();
  }, [loading, fetchAgain])

  return (
    <>
      {!chatLoading &&
        <div>
          <Navbar logout={logout} setShowSearch={setShowSearch} setShowContact={setShowContact}/>

          <SearchUser setSearchedUser={setSearchedUser} searchedUsers={searchedUsers} accessChat={accessChat} showSearch={showSearch} />

          <ChatContent blur={showSearch} chatLoading={chatLoading} showContact={showContact} setShowContact={setShowContact}/>
        </div>
      }
    </>
  )
}

export default Chat
