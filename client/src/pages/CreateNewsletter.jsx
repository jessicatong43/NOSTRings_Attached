import React, { useState, useEffect, useRef } from 'react';
import {
  getAuth, onAuthStateChanged,
} from 'firebase/auth';
import {
  getStorage, ref, uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import {
  addDoc, collection, serverTimestamp, getDoc, updateDoc, doc,
} from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../components/Spinner';
import { db } from '../firebase.config';

function CreateNewsletter() {
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    genre: 'What is it about',
    title: '',
    author: 'Who are you?',
  });
  const [getWallet, setGetWallet] = useState(false);
  const [walletAddr, setWalletAddr] = useState('');

  const {
    title, genre, author,
  } = formData;

  const navigate = useNavigate();
  const isMounted = useRef(true);

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
      genre,
      creator: auth.currentUser.uid,
      created: serverTimestamp(),
      title,
      subscribers: [],
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
      .catch((err) => {
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
    <div>
      <header>
        <p>Create a new Newsletter</p>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <label>Title: </label>
          <input
            type="text"
            className="formInputTitle"
            id="title"
            value={title}
            onChange={onMutate}
            maxLength="60"
            required
          />

          <label className="formLabel">Genre</label>
          <input
            type="string"
            className="formInputGenre"
            id="genre"
            value={genre}
            onChange={onMutate}
            required
          />

          <label className="formLabel">Author</label>
          <p className="fileInfo">
            What would you like to be called?
          </p>
          <input
            className="formInputAuthor"
            type="text"
            id="author"
            onChange={onMutate}
            value={author}
            required
          />
          <button type="submit">
            Create Newsletter
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateNewsletter;
