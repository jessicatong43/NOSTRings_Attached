import React, { useState, useEffect, useRef } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    source: '',
    preview: '',
    price: 0,
    file: {},
  });

  const {
    title, price, file,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  const { state } = useLocation();
  const { newsletterId } = state;

  // useEffect(() => {
  //   if (isMounted) {
  //     onAuthStateChanged(auth, (user) => {
  //       if (user.uid !== ) {
  //         navigate('/sign-in');
  //       }
  //     });
  //   }

  //   return () => {
  //     isMounted.current = false;
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isMounted, auth, navigate]);

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
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the
          // total number of bytes to be uploaded
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
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
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

    console.log(file[0])

    delete formDataCopy.file;

    const docRef = await addDoc(collection(db, 'Newsletters', newsletterId, 'editions'), formDataCopy);
    setLoading(false);
    toast.success('You added a new edition!');
    navigate(`/newsletters/${newsletterId}`); // Later navigate to /newsletters/${newsletterId}/editionId to view
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

  if (loading) {
    return <Spinner />;
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

          <label className="formLabel">Price in sats</label>
          <input
            type="number"
            className="formInputPrice"
            id="price"
            value={price}
            onChange={onMutate}
            required
          />

          <label className="formLabel">Source</label>
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
