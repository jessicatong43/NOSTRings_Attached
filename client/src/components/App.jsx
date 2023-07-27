import React from 'react';
import '../index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import ForgotPassword from '../pages/ForgotPassword';
import Navbar from './Navbar';
import Newsletter from '../pages/Newsletter';
import NotFound from '../pages/NotFound';
import NewEdition from '../pages/NewEdition';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<div>Hello World</div>} />
          <Route path="/newsletter/:newsletterId" element={<Newsletter />} />
          <Route path="/new-edition" element={<NewEdition />} />
          {/* <Route path='/' element={<Explore/>} />
          <Route path='/profile' element={<PrivateRoute />} >
            <Route path='/profile' element={<Profile/>} />
          </Route> */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path='/create-newsletter' element={<CreateListing/>} />
          <Route path='/edit-edition/:editionId' element={<EditListing/>} /> */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
