import React, { useEffect, useState } from 'react'
import "./CreateGroupBox.css"
import { RxCross2 } from "react-icons/rx";
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';

const CreateGroupBox = (props) => {
    const [users, setUsers] = useState([])
    const { user, contactList } = ChatState();
    const [search, setSearch] = useState();
    const [groupName, setGroupName] = useState();
    const [searchedUser, setSearchedUser] = useState();

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

    const handleRemove = (userId) => {
        setUsers(old => old.filter(i => i._id !== userId))
    }

    const submitGroup = async () => {
        let members = users.map(i => i._id)
        const gchat = await axios.post("http://localhost:5000/api/chat/group", {
            name: groupName,
            users: members,
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`
            }
        })
        props.setCreateBox(false)
    }

    useEffect(() => {
        handleSearch()
    }, [search])

    return (
        <div className='GroupBox-container'>
            <div className='GroupBox'>
                <div className='GroupBox-member-list'>
                    {users && users.map(user =>
                        <div>
                            <p>{user.name}</p>
                            <RxCross2 onClick={() => handleRemove(user._id)} />
                        </div>
                    )}
                </div>
                <hr />
                <div className='GroupBox-input-container'>
                    <div>
                        <p>Group Name : </p>
                        <input type='text' value={groupName} onChange={(e) => setGroupName(e.target.value)}></input>
                    </div>
                    <div>
                        <p>Group Members : </p>
                        <input type='text' value={search} onChange={(e) => {
                            setSearch(e.target.value)
                        }}></input>
                    </div>
                    {searchedUser &&
                        <div className='searched-item-container'>
                            {searchedUser.map(user =>
                                <div className='searched-item' onClick={() =>
                                    setUsers(old => [...old, { _id: user._id, name: user.name }])
                                } key={user._id}>
                                    <img src={user.pic}></img>
                                    <p>{user.name}</p>
                                </div>
                            )}
                        </div>
                    }
                </div>
                <div className='GroupBox-btn-container'>
                    <button className='GroupBox-btn create-btn'  onClick={() => submitGroup()}>Create</button>
                    <button className='GroupBox-btn close-btn' onClick={() => props.setCreateBox(false)}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default CreateGroupBox
