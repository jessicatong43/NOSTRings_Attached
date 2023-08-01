import React, { useState, useEffect } from 'react';
import {
  collection, getDocs, query, orderBy, limit, where, collectionGroup,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Search from '../components/Search';
import DashboardRow from '../components/DashboardRow';

function Dashboard() {
  const [newsletters, setNewsletters] = useState([]);
  const [allNewsletters, setAllNewsletters] = useState([]);
  const [editions, setEditions] = useState([]);
  const [allEditions, setAllEditions] = useState([]);
  const [ownedNewsletters, setOwnedNewsletters] = useState([]);
  const [allOwnedNewsletters, setAllOwnedNewsletters] = useState([]);
  const auth = getAuth();
  console.log(ownedNewsletters, newsletters, editions);

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
    fetchNewsletters();
    fetchEditions();
    fetchOwnedNewsletters();
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

  return (
    <div>
      <Search handleSearch={handleSearch} />
      {/* <UserNewsletters data={ownedNewsletters} /> */}
      {ownedNewsletters.length > 0
        ? <DashboardRow title="Newsletters you author" data={ownedNewsletters} type="newsletter" />
        : <div>Owned...</div>}

      <DashboardRow title="Editions you've bought" data={editions} type="edition" />
      <DashboardRow title="Newsletters you subscribe to" data={newsletters} type="newsletter" />
    </div>
  );
}

export default Dashboard;
