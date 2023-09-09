import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  doc, getDoc, updateDoc, arrayUnion, collection, getDocs, query, orderBy,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { db } from '../firebase.config';
import EditionList from '../components/EditionList';
import Subscribe from '../components/Subscribe';
import Spinner from '../components/Spinner';
import Search from '../components/Search';

function Newsletter() {
  const [newsletter, setNewsletter] = useState([]);
  const [editions, setEditions] = useState([]);
  const [displayedEditions, setDisplayedEditions] = useState();
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const navigate = useNavigate();
  const auth = getAuth();

  const fetchNewsletter = async () => {
    const docRef = doc(db, 'Newsletters', params.newsletterId);

    const editionsRef = collection(db, `Newsletters/${params.newsletterId}/editions`);

    const q = query(editionsRef, orderBy('created', 'desc'));

    const [editionsSnap, docSnap] = await Promise.all([getDocs(q), getDoc(docRef)]);
    const arr = [];
    editionsSnap.docs.forEach((d) => {
      const data = d.data();
      data.id = d.id;
      arr.push(data);
    });

    setEditions(arr);
    setDisplayedEditions(arr);

    if (docSnap.exists()) {
      setNewsletter(docSnap.data());
      setLoading(false);
    } else {
      navigate('/');
      toast.error('Sorry, we could not find this newsletter');
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
    navigate('/new-edition', { state: { newsletterId: params.newsletterId, creatorId: newsletter.creator } });
  };

  const handleSearch = (searchStr) => {
    const filtered = editions.filter(
      (item) => item.title.toLowerCase().includes(searchStr.toLowerCase()),
    );
    setDisplayedEditions(filtered);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="newsletter-page container">
      <section className="newsletter-info">
        <div className="newsletter-description">
          <h2 className="color-text newsletter-title">{newsletter.title}</h2>
          <p className="newsletter-author">
            By:&nbsp;
            {newsletter.author}
          </p>
          <p className="newsletter-summary">{newsletter.summary}</p>
        </div>
        <div className="subscribe-email">
          {(auth.currentUser && (newsletter.creator === auth.currentUser.uid))
            ? (
              <button type="button" className="gradient-btn new-edition-btn" onClick={handleNewEdition}>
                Upload a new edition!
              </button>
            )
            : <Subscribe handleSubscribe={handleSubscribe} />}
        </div>
      </section>
      <Search handleSearch={handleSearch} />
      <div className="newsletter-overview">
        <div className="newsletter-editions">
          {displayedEditions?.length > 0
            ? <EditionList editions={displayedEditions} />
            : <div className="color-text">No editions found</div>}

        </div>

      </div>
    </div>
  );
}

export default Newsletter;
