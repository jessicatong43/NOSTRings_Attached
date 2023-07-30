import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getStorage, ref, uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../components/Spinner';
import { db } from '../firebase.config';

function NewEdition() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    source: '',
    preview: '',
    price: 0,
    file: {},
  });

  const [creator, setCreator] = useState(false);

  const {
    title, price, file,
  } = formData;

  const navigate = useNavigate();

  const { state } = useLocation();
  const { newsletterId, creatorId } = state;

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      console.log(user.uid, creatorId)
      if (user.uid === creatorId) {
        setCreator(true);
      } else {
        setCreator(false);
      }
      setLoading(false);
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const storeDocument = async (pdfFile) => new Promise((resolve, reject) => {
      const storage = getStorage();
      const fileName = `${newsletterId}-${pdfFile.name}-${uuidv4()}`;

      const storageRef = ref(storage, `documents/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, pdfFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        },
      );
    });

    const docUrl = await storeDocument(file[0]);

    const formDataCopy = {
      ...formData,
      source: docUrl,
      newsletter: newsletterId,
      preview: 'Sample preview for now',
      created: serverTimestamp(),
    };

    delete formDataCopy.file;

    const docRef = await addDoc(collection(db, 'Newsletters', newsletterId, 'editions'), formDataCopy);
    setLoading(false);
    toast.success('You added a new edition!');
    navigate(`/newsletter/${newsletterId}`); // Later navigate to /newsletters/${newsletterId}/editionId(docRef.id) to view
  };

  const onMutate = (e) => {
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        file: e.target.files,
      }));
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!creator) {
    return <div>Sorry, you do not own this newsletter</div>;
  }

  return (
    <div>
      <header>
        <p>Upload a new edition</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
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

          <label>Price in sats</label>
          <input
            type="number"
            className="formInputPrice"
            id="price"
            value={price}
            onChange={onMutate}
            required
          />

          <label >Source</label>
          <p className="fileInfo">
            Please upload a PDF for this edition
          </p>
          <input
            className="formInputFile"
            type="file"
            id="file"
            onChange={onMutate}
            accept=".pdf,.doc,.docx"
            required
          />
          <button type="submit">
            Create Edition
          </button>
        </form>
      </main>
    </div>
  );
}

export default NewEdition;
