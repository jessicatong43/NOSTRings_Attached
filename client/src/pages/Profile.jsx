import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import {
  collection, getDocs, query, where, orderBy,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import ExploreCard from '../components/ExploreCard';

function Profile() {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [newsletters, setNewsletters] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    const fetchNewsletters = async () => {
      const newslettersRef = collection(db, 'Newsletters');

      const q = query(
        newslettersRef,
        where('creator', '==', auth.currentUser.uid),
        orderBy('created', 'desc'),
      );

      const querySnap = await getDocs(q);

      const newslettersArr = [];

      querySnap.forEach((d) => newslettersArr.push({
        id: d.id,
        data: d.data(),
      }));

      console.log(newslettersArr);
      setNewsletters(newslettersArr);
      setLoading(false);
    };

    fetchNewsletters();
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">

      <main className="profile-grid">
        <section>
          <div className="profile-newsletter-header">
            <h3>Your Newsletters</h3>
            <Link to="/create-newsletter" className="createNewsletter">
              <p>+ Create</p>
            </Link>
          </div>
          <div>
            {!loading && newsletters?.length > 0 ? (
              <ul className="yourNewsletters">
                {newsletters.map((newsletter) => (
                  <ExploreCard
                    key={newsletter.id}
                    newsletter={newsletter.data}
                    newsletterId={newsletter.id}
                  />
                ))}
              </ul>
            ) : <p>You do not have any newsletters yet</p> }
          </div>
        </section>

        <section className="user-info">
          <small>Username</small>
          <p>{auth.currentUser.displayName || null}</p>
          <br />
          <small>Email</small>
          <p>{auth.currentUser.email || null}</p>
          <br />
          <button
            type="button"
            onClick={onLogout}
            className="gradient-btn"
          >
            Logout
          </button>
        </section>
      </main>
    </div>
  );
}

export default Profile;
