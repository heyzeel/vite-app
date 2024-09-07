import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import "./OpenedChatBox.css"
import { ChatState } from '../../Context/ChatProvider'
import GroupChatHeader from '../GroupChatHeader/GroupChatHeader';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../config/ChatLogic';
import Lottie from 'react-lottie'
import animationData from "../animation/indicator.json"

import io from 'socket.io-client'

const ENDPOINT = 'http://localhost:5000';
let socket, selectedChatCompare;

const OpenedChatBox = () => {
    const listRef = useRef(null);
    const { openedChat, user, notification, setNotification, setFetchAgain} = ChatState();
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false)

    useEffect(()=>{
        socket = io(ENDPOINT)
        socket.emit("setup",user)
        socket.on("connected",()=>setSocketConnected(true))
        socket.on("typing",()=>setIsTyping(true))
        socket.on("stop typing",()=>setIsTyping(false))
    },[])

    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            socket.emit("stop typing", openedChat._id);
            try {
                setNewMessage("")
                const { data } = await axios.post("http://localhost:5000/api/message", {
                    chatId: openedChat._id,
                    content: newMessage
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                })
                socket.emit("new message",data);
                setMessages([...messages, data])

            } catch (error) {
                console.log(error)
            }
        }
    }
    const fetchMessages = async () => {
        if (!openedChat) return;
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:5000/api/message/${openedChat._id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            setMessages(data);
            setLoading(false);
            socket.emit("join chat",openedChat._id)

        } catch (error) {
            console.log(error)
        }
    }
    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        if(!socketConnected) return;
       
        if(!typing){
            setTyping(true);
            socket.emit("typing", openedChat._id)
        }
    }

    useEffect(() => {
        fetchMessages()
        selectedChatCompare = openedChat
    }, [openedChat])

    useEffect(()=>{
        socket.on("message recieved", (newMessageRecieved)=>{
            if(
                !selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id
            ){
                // notification
                if(!notification.includes(newMessageRecieved)){
                    setNotification([...notification,newMessageRecieved])
                    setFetchAgain(true)
                }
            }
            else{
                setMessages([...messages, newMessageRecieved])
            }
        })
        listRef.current?.scrollIntoView({ behavior: "smooth" })
    })

    useEffect(()=>{
        let lastTypeTime = new Date().getTime();
        var timerLength = 3000;

        setTimeout(()=>{
            var timeNow = new Date().getTime();
            var timeDiff = timeNow-lastTypeTime;

            if(timeDiff >= timerLength && typing){
                console.log("entered")
                socket.emit("stop typing", openedChat._id);
                setTyping(false)
            }
        }, timerLength)
    },[typing])

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      };

    return (
        <div className='OpenedChatBox-container'>
            {!openedChat.isGroupChat ? <h2>{openedChat.users[0].name === user.name ? openedChat.users[1].name : openedChat.users[0].name}</h2> :
                <GroupChatHeader />
            }
            <div className='messages-container'>
                <div className='message-list'>
                    {loading ? <>Loading</> : <>
                        {messages.map((m, i) =>
                            <div key={m._id} className='message'  style={
                                    {
                                        marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                        marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                                        alignSelf:m.sender._id===user._id?'flex-end':'flex-start',
                                    }
                                }>

                                {(isSameSender(messages, m, i, user._id) ||
                                    isLastMessage(messages, i, user._id)) && (
                                        <img src={m.sender.pic}></img>
                                    )
                                }
                                <span className={
                                    m.sender._id===user._id?'user-message':'non-user-message'
                                    }>
                                    {m.content}
                                </span>

                            </div>
                        )}
                    </>
                    }
                    
                    <div className='typing-indicator' >
                        {isTyping&&<Lottie options={defaultOptions} height={30} width={50}/>}
                    </div>
                    <div ref={listRef}></div>
                </div>
                <input type='text' value={newMessage} onKeyDown={sendMessage} onChange={typingHandler}></input>
            </div>
        </div>
    )
}

export default OpenedChatBox