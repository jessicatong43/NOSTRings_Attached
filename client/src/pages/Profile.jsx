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
      <header className="profileHeader">
        <p className="pageHeader">Profile</p>
        <button
          type="button"
          onClick={onLogout}
          className="logOut"
        >
          Logout
        </button>
      </header>

      <main>

        <div className="profileCard">
          <p>{`Username: ${auth.currentUser.displayName || null}`}</p>
          <p>{`Email: ${auth.currentUser.email || null}`}</p>
        </div>

        <Link to="/create-newsletter" className="createNewsletter">
          <p>Create your own newsletter!</p>
        </Link>
        {!loading && newsletters?.length > 0 ? (
          <>
            <p>Your Newsletters</p>
            <ul>
              {newsletters.map((newsletter) => (
                <ExploreCard
                  key={newsletter.id}
                  newsletter={newsletter}
                />
              ))}
            </ul>
          </>
        ) : <p>You do not have any newsletters yet</p> }
      </main>
    </div>
  );
}

export default Profile;
