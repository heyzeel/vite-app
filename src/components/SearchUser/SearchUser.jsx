import React, { useState } from 'react'
import "./SearchUser.css"
import { FaSearch } from "react-icons/fa";
import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider';

const SearchUser = (props) => {

    const { user } = ChatState();

    const [search, setSearch] = useState();

    const handleSearch = async () => {
        if (!search) {
            return alert("Field is empty!")
        }
        try {
            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
            props.setSearchedUser(data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='search-user-container' id={props.showSearch?"show-search":"not-show-search"}>
            <div className='search-input-container'>
                <input type='search' id='search-input' value={search} onChange={(e) => setSearch(e.target.value)} autoComplete="off"></input>
                <FaSearch id='search-btn' onClick={handleSearch} />
            </div>

            <div className='search-item-container'>
                {!search && props.setSearchedUser()}
                {props.searchedUsers && props.searchedUsers.map(i =>
                    <div className='search-item' key={i._id} onClick={() => props.accessChat(i._id)}>
                        <img src={i.pic}></img>
                        <h3>{i.name}</h3>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchUser
