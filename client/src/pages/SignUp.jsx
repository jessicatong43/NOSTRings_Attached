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
      console.log(error);
      toast.error('Registration error: please use a valid email and more than 8 characters in the password!');
    }
  };

  return (
    <div>
      <header>
        <p>
          Sign Up
        </p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            className="nameInput"
            placeholder="Username"
            id="username"
            value={username}
            onChange={onChange}
          />

          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />

          <div>
            <input
              type="password"
              className="passwordInput"
              placeholder="Password"
              id="password"
              value={password}
              onChange={onChange}
            />

          </div>

          <Link to="/forgot-password">
            Forgot Password
          </Link>

          <div>
            <p>
              Sign Up
            </p>
            <button>
              Icon Here
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
