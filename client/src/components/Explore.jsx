import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import ExploreCard from './ExploreCard';

function Explore() {
  const [newsletters, setNewsletters] = useState([]);
  // const params = useParams();
  // const navigate = useNavigate();

  console.log('newsletters: ', newsletters);

  const handleClick = (e) => {
    e.preventDefault();
    // TODO: Write handleClick
    console.log('event: ', e);
  };

  const fetchNewsletters = async () => {
    const querySnapshot = await getDocs(collection(db, 'Newsletters'));
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
          <ExploreCard newsletter={newsletter} onClick={handleClick} key={newsletter.id} />
        ))}
      </section>
    );
  }

  return content;
}

export default Explore;
