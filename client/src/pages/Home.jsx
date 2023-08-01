import React, { useState, useEffect } from 'react';
import {
  collection, getDocs, query, orderBy, limit,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import Search from '../components/Search';
import Explore from '../components/Explore';

function Home() {
  const [newsletters, setNewsletters] = useState([]);
  const [allNewsletters, setAllNewsletters] = useState([]);

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
    setAllNewsletters(allDocs);
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const handleSearch = (searchStr) => {
    const filtered = allNewsletters.filter(
      (item) => item.title.toLowerCase().includes(searchStr.toLowerCase()),
    );
    setNewsletters(filtered);
  };

  return (
    <div className="container">
      <Search handleSearch={handleSearch} />
      <Explore newsletters={newsletters} />
    </div>
  );
}

export default Home;
