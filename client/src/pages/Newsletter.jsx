import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import EditionList from '../components/EditionList';

function Newsletter() {
  const [editions, setEditions] = useState([]);

  const params = useParams();
  const navigate = useNavigate();

  const fetchNewsletter = async () => {
    const docRef = doc(db, 'Newsletters', params.newsletterId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setEditions(docSnap.data().editions);
    }
  };

  useEffect(() => {
    fetchNewsletter();
  }, [params.newsletterId]);

  return (
    <div>
      <div>SearchBar</div>
      <div className="newsletter-overview">
        <div>
          <EditionList editions={editions} />
        </div>
        <div>
          Subscribe/authorInfo
        </div>
      </div>
    </div>
  );
}

export default Newsletter;
