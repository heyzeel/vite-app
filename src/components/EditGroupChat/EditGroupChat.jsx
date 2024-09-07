import React, { useState, useEffect } from 'react'
import './EditGroupChat.css'
import { ChatState } from '../../Context/ChatProvider'
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';

const EditGroupChat = ({setShowEditGroup}) => {
    const { user,openedChat, setOpenedChat, setLoading } = ChatState();
    const [updateName, setUpdateName] = useState()
    const [updateUsers, setUpdateUsers] = useState(openedChat.users)
    const [searchedUser, setSearchedUser] = useState();
    const [search, setSearch] = useState();

    const handleSearch = async () => {
        if (!search) {
            return setSearchedUser(false)
        }
        try {
            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
            setSearchedUser(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAdd = async(UserId)=>{
        const addUser = await axios.put("http://localhost:5000/api/chat/groupadd",
        {
            userId:UserId,
            chatId:openedChat._id
        },{
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${user.token}`
            }
        })
       console.log(addUser)
    }

    const handleRemove = async(UserId) => {
        
        const removeUser = await axios.put("http://localhost:5000/api/chat/groupremove",
            {
                userId:UserId,
                chatId:openedChat._id
            },{
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${user.token}`
                }
            })
           console.log(removeUser)
           setUpdateUsers(old => old.filter(i => i._id !== UserId))
    }

    const handleUpdate = async()=>{
        if(!updateName){
            return alert("field is empty")
        }
        const groupName =  await axios.post("http://localhost:5000/api/chat/rename",
            {
                chatId:openedChat._id,
                chatName:updateName
            },
            {
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${user.token}`
                }
            }
        )
        setLoading(true)
        setOpenedChat()
        console.log(groupName)
    }
    useEffect(() => {
        handleSearch()
    }, [search])

    return (
        <div className='GroupBox-container'>
            <div className='EditGroupBox'>
                <h2 className='EditGroupBox-title'>Edit Group</h2>
                <div className='GroupBox-member-list'>
                    {updateUsers.map(user =>
                        <div>
                            <p>{user.name}</p>
                            <RxCross2 onClick={()=>{
                                handleRemove(user._id)}}/>
                        </div>
                    )}
                </div>
                <div className='EditGroupBox-bottom'>
                        <p>Change Group Name : </p>
                        <input type='text' value={updateName} onChange={(e) => setUpdateName(e.target.value)}></input>
                        <p> Add Group Member : </p>
                        <input type='text' value={search} onChange={(e) => {
                            setSearch(e.target.value)
                        }}></input>
                    
                        <div className='searched-user-container'>
                            {searchedUser&&
                                searchedUser.map(user=>
                                <div className='searched-item' onClick={()=>
                                {setUpdateUsers(old=>[...old,{_id:user._id,name:user.name}])
                                handleAdd(user._id)
                                }
                                }>
                                    <img src={user.pic}></img>
                                    <p>{user.name}</p>
                                </div>
                                )
                            }
                        </div>
                    <button className='GroupBox-btn create-btn' onClick={()=>handleUpdate()}>Update</button>
                    <button className='GroupBox-btn close-btn' onClick={()=>{
                        setShowEditGroup(false)
                        setLoading(true)
                        setOpenedChat()}}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default EditGroupChat