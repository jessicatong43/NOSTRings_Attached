import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const { email, password, username } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      updateProfile(auth.currentUser, {
        displayName: username,
      });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, 'users', userCredential.user.uid), formDataCopy);
      navigate('/');

      toast.success(`Welcome ${username}`);
    } catch (error) {
      toast.error('Registration error: please use a valid email and more than 8 characters in the password!');
    }
  };

  return (
    <div className="sign-in-container container">
      <header>
        <h3 className="color-text">
          Sign Up
        </h3>
        <br />
      </header>

      <main className="sign-in-main">
        <form className="sign-in-form" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Username"
            id="username"
            value={username}
            onChange={onChange}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={onChange}
          />

          <div id="sign-in-button">
            <button type="submit" className="form-btn">
              Sign Up
            </button>
          </div>
        </form>

        <Link to="/sign-in">
          Sign In Instead
        </Link>
      </main>
    </div>
  );
}

export default SignUp;
