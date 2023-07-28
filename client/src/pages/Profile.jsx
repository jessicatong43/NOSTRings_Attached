import { React, useState, useEffect } from 'react';

function Profile() {
  const [latest, setLatest] = useState([]);
  const [owned, setOwned] = useState([]);
  const [created, setCreated] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {

    // TODO: set states
    // setLatest();
    // setOwned();
    // setCreated();
    // setSubscriptions();
  }, []);

  return (
    <div id="profile">
      Profile Page
      <section className="profile-category">
        <h2>Latest</h2>
      </section>
      <section className="profile-category">
        <h2>Owned</h2>
      </section>
      <section className="profile-category">
        <h2>Created</h2>
      </section>
      <section className="profile-category">
        <h2>Subscriptions</h2>
      </section>
    </div>
  );
}

export default Profile;
