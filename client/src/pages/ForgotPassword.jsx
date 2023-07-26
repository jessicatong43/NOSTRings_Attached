import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const onChange = (e) => setEmail(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('Email was sent');
    } catch (error) {
      toast.error('Unable to send reset email');
    }
  };

  return (
    <div>
      <header>
        <p>
          Forgot Password
        </p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />
          <Link to="/sign-in">
            Sign In
          </Link>

          <div className="signInBar">
            <div className="signInText">
              Send Reset Link
            </div>
            <button type="button" className="signInButton">
              Icon Here
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ForgotPassword;
