import React, { useState, useEffect } from 'react';
import '../index.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<div>Hello World</div>} />
          {/* <Route path='/' element={<Explore/>} />
          <Route path='/profile' element={<PrivateRoute />} >
            <Route path='/profile' element={<Profile/>} />
          </Route>
          <Route path='/sign-in' element={<SignIn/>} />
          <Route path='/sign-up' element={<SignUp/>} />
          <Route path='/forgot-password' element={<ForgotPassword/>} />
          <Route path='/create-newsletter' element={<CreateListing/>} />
          <Route path='/edit-edition/:editionId' element={<EditListing/>} /> */}
        </Routes>
        <Navbar/>
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
