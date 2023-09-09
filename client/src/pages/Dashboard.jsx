import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  collection, getDocs, query, orderBy, limit, where, collectionGroup,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Search from '../components/Search';
import DashboardRow from '../components/DashboardRow';
import Spinner from '../components/Spinner';

function Dashboard() {
  const [newsletters, setNewsletters] = useState([]);
  const [allNewsletters, setAllNewsletters] = useState([]);
  const [editions, setEditions] = useState([]);
  const [allEditions, setAllEditions] = useState([]);
  const [ownedNewsletters, setOwnedNewsletters] = useState([]);
  const [allOwnedNewsletters, setAllOwnedNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  const fetchNewsletters = async () => {
    const newslettersRef = collection(db, 'Newsletters');
    const q = query(
      newslettersRef,
      orderBy('created', 'desc'),
      where('subscribers', 'array-contains', auth.currentUser.email),
      limit(10),
    );
    const querySnapshot = await getDocs(q);
    const allDocs = [];

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      docData.id = doc.id;
      allDocs.push(docData);
    });

    setNewsletters(allDocs);
    setAllNewsletters(allDocs);
  };

  const fetchOwnedNewsletters = async () => {
    const newslettersRef = collection(db, 'Newsletters');
    const q = query(
      newslettersRef,
      orderBy('created', 'desc'),
      where('creator', '==', auth.currentUser.uid),
      limit(10),
    );
    const querySnapshot = await getDocs(q);
    const allDocs = [];

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      docData.id = doc.id;
      allDocs.push(docData);
    });

    setOwnedNewsletters(allDocs);
    setAllOwnedNewsletters(allDocs);
  };

  const fetchEditions = async () => {
    const editionsRef = collectionGroup(db, 'editions');
    const q = query(
      editionsRef,
      orderBy('created', 'desc'),
      where('paid', 'array-contains', auth.currentUser.email),
      limit(10),
    );
    const querySnapshot = await getDocs(q);
    const allDocs = [];

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      docData.id = doc.id;
      allDocs.push(docData);
    });

    setEditions(allDocs);
    setAllEditions(allDocs);
  };

  useEffect(() => {
    Promise.all([fetchNewsletters(), fetchEditions(), fetchOwnedNewsletters()])
      .then((results) => setLoading(false));
  }, []);

  const handleSearch = (searchStr) => {
    const filtered = allNewsletters.filter(
      (item) => item.title.toLowerCase().includes(searchStr.toLowerCase()),
    );
    setNewsletters(filtered);

    const filteredEditions = allEditions.filter(
      (item) => item.title.toLowerCase().includes(searchStr.toLowerCase()),
    );
    setEditions(filteredEditions);

    const filteredOwned = allOwnedNewsletters.filter(
      (item) => item.title.toLowerCase().includes(searchStr.toLowerCase()),
    );
    setOwnedNewsletters(filteredOwned);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="grid">
      <Search handleSearch={handleSearch} />
      <DashboardRow title="Newsletters you author" data={ownedNewsletters} type="owned-newsletters" />

      <DashboardRow title="Editions you've bought" data={editions} type="edition" />
      <DashboardRow title="Newsletters you subscribe to" data={newsletters} type="newsletter" />
    </div>
  );
}

export default Dashboard;
