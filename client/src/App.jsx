import './App.css'
import React, {useEffect, useState} from 'react'
import {Route, Routes } from 'react-router-dom';

function App() {      

  return (
    <div>
        <Routes>
          <Route path="/" element={<Index/>}/>
        </Routes>
    </div>
  )
}

export default App
