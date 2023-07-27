import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  doc, getDoc, updateDoc, arrayUnion, collection, getDocs, query, orderBy,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import { db } from '../firebase.config';
import EditionList from '../components/EditionList';
import Subscribe from '../components/Subscribe';
import Spinner from '../components/Spinner';

function Newsletter() {
  const [newsletter, setNewsletter] = useState([]);
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  console.log(editions);

  const fetchNewsletter = async () => {
    const docRef = doc(db, 'Newsletters', params.newsletterId);

    const editionsRef = collection(db, `Newsletters/${params.newsletterId}/editions`);

    const q = query(editionsRef, orderBy('created'));

    const [editionsSnap, docSnap] = await Promise.all([getDocs(q), getDoc(docRef)]);
    const arr = [];
    editionsSnap.docs.forEach((d) => {
      arr.push(d.data());
    });

    setEditions(arr);

    if (docSnap.exists()) {
      setNewsletter(docSnap.data());
      setLoading(false);
    } else {
      navigate('/');
      toast.error('Listing does not exist');
    }
  };

  useEffect(() => {
    fetchNewsletter();
  }, [params.newsletterId]);

  const handleSubscribe = async (e, email) => {
    e.preventDefault();
    const docRef = doc(db, 'Newsletters', params.newsletterId);

    updateDoc(docRef, {
      subscribers: arrayUnion(email),
    })
      .then(() => {
        toast.success(`You've successfully subscribed to ${newsletter.title}`);
      })
      .catch(() => {
        toast.error('Sorry, we were unable to subscribe you');
      });
  };

  const handleNewEdition = () => {
    navigate('/new-edition', { state: { newsletterId: params.newsletterId } });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="newsletter-page">
      <div>SearchBar</div>
      <div className="newsletter-overview">
        <div className="newsletter-editions">
          <EditionList editions={editions || []} />
        </div>
        <div className="newsletter-info">
          <Subscribe handleSubscribe={handleSubscribe} />
          {(auth.currentUser && (newsletter.creator === auth.currentUser.uid))
            ? (
              <button type="button" className="gradient-btn" onClick={handleNewEdition}>
                Upload a new edition!
              </button>
            )
            : null}

        </div>
      </div>
    </div>
  );
}

export default Newsletter;
