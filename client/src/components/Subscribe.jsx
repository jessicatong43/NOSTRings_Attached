import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
        Email
        <br />
        <input
          id="email"
          value={email}
          type="email"
          required
          onChange={handleChange}
          className="subscribe-email-input"
        />
      </label>

      <button type="submit" className="gradient-btn subscribe-btn">
        Subscribe
      </button>
    </form>
  );
}

export default Subscribe;
