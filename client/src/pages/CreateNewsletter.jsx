import React, { useState, useEffect } from 'react';
import {
  getAuth, onAuthStateChanged,
} from 'firebase/auth';
import {
  addDoc, collection, serverTimestamp, getDoc, updateDoc, doc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../components/Spinner';
import { db } from '../firebase.config';

function CreateNewsletter() {
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    summary: 'What is it about',
    title: '',
    author: 'Who are you?',
  });
  const [getWallet, setGetWallet] = useState(false);
  const [walletAddr, setWalletAddr] = useState('');

  const {
    title, summary, author,
  } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    const checkPayment = async () => {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(docRef);

      if (!userSnap.data().payment) {
        setGetWallet(true);
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user.uid) {
        checkPayment();
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formDataCopy = {
      ...formData,
      author,
      summary,
      creator: auth.currentUser.uid,
      created: serverTimestamp(),
      title,
      subscribers: [],
      genres: [],
    };

    const docRef = await addDoc(collection(db, 'Newsletters'), formDataCopy);
    setLoading(false);
    toast.success('You added a new newsletter!');
    navigate(`/newsletter/${docRef.id}`); // Later navigate to /newsletters/${newsletterId}/editionId to view
  };

  const onMutate = (e) => {
    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        file: e.target.files,
      }));
    }

    // Text/num
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
  };

  const handleWallet = async () => {
    const docRef = await doc(db, 'users', auth.currentUser.uid);
    updateDoc(docRef, {
      payment: walletAddr,
    })
      .then(() => {
        setGetWallet(false);
      })
      .catch(() => {
        toast.error('Sorry, we were unable to add this wallet!');
      });
  };

  const handleChange = (e) => {
    setWalletAddr(e.target.value);
  };

  if (loading) {
    return <Spinner />;
  }

  if (getWallet) {
    return (
      <div>
        Please add an Alby payment address first!
        <input value={walletAddr} type="text" id="walletAddr" onChange={handleChange} required />
        <button type="button" onClick={handleWallet}>
          add
        </button>
      </div>
    );
  }

  return (
    <div className="form-container container">
      <div className="form-card">
        <header className="create-header">
          <h3 className="color-text">Create a new newsletter</h3>
        </header>

        <main>
          <form className="sign-in-form create center" onSubmit={handleSubmit}>
            <label htmlFor="title">
              Title
              <input
                type="text"
                id="title"
                value={title}
                onChange={onMutate}
                maxLength="60"
                required
              />
            </label>

            <label htmlFor="summary">
              Summary
              <br/>
              <textarea
                type="string"
                id="summary"
                value={summary}
                onChange={onMutate}
                required
              />
            </label>

            <label htmlFor="author">
              Author
              <input
                type="text"
                id="author"
                onChange={onMutate}
                value={author}
                required
              />
            </label>

            <button type="submit" className="gradient-btn">
              Create Newsletter
            </button>
          </form>
        </main>
      </div>
    </div>

  );
}

export default CreateNewsletter;
