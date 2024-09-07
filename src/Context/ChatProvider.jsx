import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const navigate = useNavigate()

    const [user, setUser] = useState();
    const [contactList, setContactList] = useState([]);
    const [openedChat, setOpenedChat] = useState();
    const [loading, setLoading] = useState(true)
    const [fetchAgain, setFetchAgain] = useState(false)
    const [notification, setNotification] = useState([]);

    useEffect(() => {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"))
            setUser(userInfo)
            if (!userInfo) navigate("/")
    }, [navigate])

    useEffect(()=>{
        if(user)setLoading(false)
    },[user,loading])

    return <ChatContext.Provider value={{ user, setUser, contactList, setContactList, openedChat, setOpenedChat, loading, setLoading, notification, setNotification,fetchAgain, setFetchAgain}}>
        {children}
    </ChatContext.Provider>
}

export const ChatState = () => {
    return useContext(ChatContext)
}

export default ChatProvider;