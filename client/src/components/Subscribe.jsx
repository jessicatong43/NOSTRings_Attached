import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase.config';

function Subscribe({ handleSubscribe }) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      }
    });
  }, []);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <form onSubmit={(e) => handleSubscribe(e, email)} className="subscribe-form">
      <label htmlFor="email">
        Email:
        <input
          id="email"
          value={email}
          type="email"
          required
          onChange={handleChange}
        />
      </label>

      <button type="submit" className="gradient-btn">
        Subscribe
      </button>
    </form>
  );
}

export default Subscribe;
