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
    <div className="sign-in-container container">
      <header>
        <h3 className="color-text">
          Reset Password
        </h3>
        <br />
      </header>

      <main className="sign-in-main">
        <form className="sign-in-form" onSubmit={onSubmit}>
          <input
            type="email"
            className="emailInput"
            placeholder="Email"
            id="email"
            value={email}
            onChange={onChange}
          />

          <div id="sign-in-button">
            <button type="submit" className="form-btn">
              Reset
            </button>
          </div>
        </form>
        <Link to="/sign-in">
          Back to Sign In
        </Link>
      </main>
    </div>
  );
}

export default ForgotPassword;
