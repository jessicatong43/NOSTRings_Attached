import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import {
  collection, getDocs, query, where, orderBy,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import ExploreCard from '../components/ExploreCard';
import Spinner from '../components/Spinner';

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
    return <Spinner />;
  }

  return (
    <div className="profile container">

      <main className="profile-grid">
        <section>
          <div className="profile-newsletter-header">
            <h3 className="color-text">Your Newsletters</h3>
            <br />
          </div>
          <div>
            {!loading && newsletters?.length > 0 ? (
              <ul className="yourNewsletters">
                <Link to="/create-newsletter" className="createNewsletter create-btn">
                  <p>+ Create</p>
                </Link>
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
          {/* <Link to="/create-newsletter" className="createNewsletter">
            <p>+ Create</p>
          </Link> */}
          <br />
          <button
            type="button"
            onClick={onLogout}
          >
            Logout
          </button>
        </section>
      </main>
    </div>
  );
}

export default Profile;
