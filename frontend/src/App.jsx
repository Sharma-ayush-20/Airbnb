import React, { useContext } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ListingPage1 from './pages/ListingPage1'
import ListingPage2 from './pages/ListingPage2'
import ListingPage3 from './pages/ListingPage3'
import { AppContext } from './Context/AppContext'
import MyListing from './pages/MyListing'
import ViewDetails from './pages/ViewDetails'
import Mybooking from './pages/Mybooking'

function App() {

  const { userData } = useContext(AppContext)

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/listingpage1' element={userData !== null ? <ListingPage1 /> : <Navigate to={"/"} />} />
        <Route path='/listingpage2' element={userData !== null ? <ListingPage2 /> : <Navigate to={"/"} />} />
        <Route path='/listingpage3' element={userData !== null ? <ListingPage3 /> : <Navigate to={"/"} />} />
        <Route path='/mylisting' element={userData !== null ? <MyListing/> : <Navigate to={"/"} />} />
        <Route path='/view/:listId' element={userData !== null ? <ViewDetails/> : <Navigate to={"/"} />} />
        <Route path='/mybooking' element={userData !== null ? <Mybooking/> : <Navigate to={"/"} />} />
      </Routes>
    </>
  )
}

export default App
