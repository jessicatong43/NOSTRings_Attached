import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (userCredential.user) {
        navigate('/');
      }

      const name = await auth.currentUser.displayName;
      toast.success(`Welcome back ${name}`);
    } catch (error) {
      toast.error('Incorrect user credentials');
    }
  };

  return (
    <div className="sign-in-container container">
      <header>
        <h3 className="color-text">
          Welcome Back
        </h3>
        <br />
      </header>

      <main className="sign-in-main">
        <form className="sign-in-form" onSubmit={onSubmit}>
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

          <Link to="/forgot-password">
            <small>Forgot Password</small>
          </Link>

          <div id="sign-in-button">
            <button type="submit" className="form-btn">
              Sign In
            </button>
          </div>
        </form>

        <Link to="/sign-up">
          <small>Sign Up Instead</small>
        </Link>
      </main>
    </div>
  );
}

export default SignIn;
