import React, { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import Chat from './pages/Chat.jsx'

function App() {
  return (
    <div className='App'>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          {<Route path='/chat' element={<Chat/>}></Route>}
        </Routes>
    </div>
  )
}

export default App
