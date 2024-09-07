import React, { useEffect, useState } from 'react';
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
import { ChatState } from '../Context/ChatProvider';


const SignUp = (props) => {
  const navigate = useNavigate();
  const [picture, setPic] = useState();
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    pic: undefined
  })

  const postUser = async () => {
    let user;
    await axios.post("http://localhost:5000/api/user/register", formData, {
      headers: {
        "Content-Type": "application/json",
      }
    }).then(res => user = res.data)
    
    if(user.token){
      localStorage.setItem('userInfo',JSON.stringify({_id:user._id, name : user.name, email : user.email, pic:user.pic, token: user.token}))
      const authUser = JSON.parse(localStorage.getItem('userInfo')) 
      if(authUser) {navigate("/chat")}
    }
    
  }

  useEffect(() => {
    loading && postUser()
  }, [formData.pic])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const submitSignUp = async () => {

    const { name, email, password } = formData;
    if (!name || !email || !password) {
      alert("Please Enter Required Fields!")
    }
    else {
      // profile pic upload
      if (picture) {
        const data = new FormData;
        data.append('avatar', picture);
        await axios.post("http://localhost:5000/api/user/profile", data)
          .then(res => { setFormData({ ...formData, pic: res.data.url }) })
          .then(er => console.log(er))
        setLoading(true)
      }
      else {
        postUser()
      }
    }
  }

  return (
    <div className='sign-container'>
    <h1>Welcome to Charcha</h1>
      <div className='sign-form'>
        <input type='text' name='name' placeholder='Name' onChange={handleChange} value={formData.username}></input>

        <input type='text' name='email' placeholder='Email' onChange={handleChange} value={formData.email}></input>

        <label className='password-container'>
          <input type={showPass ? 'text' : 'password'} name='password' placeholder='Password' onChange={handleChange} value={formData.password} id='pass-inp'>
          </input>
          {showPass ? <FaRegEye className='eye' onClick={() => { setShowPass(!showPass) }} />
            : <FaRegEyeSlash className='eye' onClick={() => { setShowPass(!showPass) }} />}
        </label>

        <div className='pic-selector-container'>
          Upload Profile (optional) :
          <label>
          <FiUploadCloud className='upload-icon'/>
          <input type='file' accept='image/*' id='pic-selector' onChange={(e) => { setPic(e.target.files[0]) }} name='avatar'/>
          </label>
        </div>

        <hr></hr>

        <input type='submit' value='Sing Up' className='sign-btn' onClick={submitSignUp}></input>
        <div className='sign-bottom'>
          <span>Already a member?<Link onClick={()=>props.setState(false)}>Login now</Link></span>
        </div>
      </div>
    </div>
  )
}

export default SignUp
