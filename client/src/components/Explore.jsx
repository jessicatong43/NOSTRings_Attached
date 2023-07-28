import React, { useState, useEffect } from 'react';
import {
  collection, getDocs, query, orderBy, limit,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import ExploreCard from './ExploreCard';

function Explore() {
  const [newsletters, setNewsletters] = useState([]);

  console.log('newsletters: ', newsletters);

  const fetchNewsletters = async () => {
    const newslettersRef = collection(db, 'Newsletters');
    const q = query(
      newslettersRef,
      orderBy('created', 'desc'),
      limit(10),
    );
    const querySnapshot = await getDocs(q);
    const allDocs = [];

    querySnapshot.forEach((doc) => {
      // console.log(doc.id, ' => ', doc.data());
      const docData = doc.data();
      docData.id = doc.id;
      allDocs.push(docData);
    });

    setNewsletters(allDocs);
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  let content = <section id="explore">Explore</section>;

  if (newsletters.length) {
    content = (
      <section id="explore">
        {newsletters.map((newsletter) => (
          <ExploreCard
            newsletter={newsletter}
            key={newsletter.id}
            newsletterId={newsletter.id}
          />
        ))}
      </section>
    );
  }

  return content;
}

export default Explore;
