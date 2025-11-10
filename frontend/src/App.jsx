import React from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Createpost from './pages/Createpost'

export default function App() {
  return (
    <>
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/post' element={<Createpost />}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}
