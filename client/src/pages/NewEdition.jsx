import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getStorage, ref, uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import {
  addDoc, collection, serverTimestamp, doc, getDoc,
} from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { db } from '../firebase.config';
import { getDocument } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist/webpack';
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "../../build/webpack/pdf.worker.bundle.js";

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
    title, price, file, preview,
  } = formData;

  const navigate = useNavigate();

  const { state } = useLocation();
  const { newsletterId, creatorId } = state;

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
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
          toast.error('Please keep files under 2MB');
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
      created: serverTimestamp(),
    };

    delete formDataCopy.file;

    const docRef = await addDoc(collection(db, 'Newsletters', newsletterId, 'editions'), formDataCopy);
    setLoading(false);
    toast.success('You added a new edition!');

    const data = {
      service_id: process.env.SERVICE_ID,
      template_id: process.env.PREVIEW_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      template_params: {},
    };

    const newsletterRef = doc(db, 'Newsletters', newsletterId);
    const newsletterSnap = await getDoc(newsletterRef);
    if (newsletterSnap.exists()) {
      const newsletterData = newsletterSnap.data();
      data.template_params.newsletter_title = newsletterData.title;
      data.template_params.edition_preview = formDataCopy.preview;
      data.template_params.edition_title = formDataCopy.title;
      data.template_params.newsletter_author = newsletterData.author;
      data.template_params.price = formDataCopy.price;
      data.template_params.payment_link = `http://localhost:3000/payment/${newsletterId}/${docRef.id}`;

      newsletterData.subscribers.forEach(async (email) => {
        data.template_params.to_email = email;
        try {
          await axios.post('https://api.emailjs.com/api/v1.0/email/send', data);
        } catch {
          toast.success(`Sorry, we were unable to send your preview to ${email}`);
        }
      });
    } else {
      navigate('/');
      toast.error('Sorry, we could not find this newsletter');
    }

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

  const generatePreview = async () => {
    try {
      const pdfData = new Uint8Array(await file[0].arrayBuffer());
      const pdf = await getDocument(pdfData).promise;
      let text = '';

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const pageText = await page.getTextContent();
        text += pageText.items.map(item => item.str).join(' ');
      }
      console.log(text)
      const generatedPreview = await axios.post('/summary', { text });
      //const previewText = generatedPreview.data;
      setFormData((prevDetails) => ({ ...prevDetails, preview: generatedPreview.data }))

    } catch (error) {
      console.error('Error converting PDF to text:', error);
      throw error;
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!creator) {
    return <div className="color-text">Sorry, you do not own this newsletter</div>;
  }

  return (
    <div className="form-container container">
      <div className="form-card center">
        <header className="create-header">
          <h3 className="color-text">Upload a new edition</h3>
        </header>

        <main>
          <form className="sign-in-form create center" onSubmit={onSubmit}>
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

            <label htmlFor="price">
              Price in sats

              <input
                type="number"
                id="price"
                value={price}
                onChange={onMutate}
                required
              />
            </label>

            <label htmlFor="file">
              Source
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
            </label>

            <label htmlFor="preview">
              Short preview
              <br/>
              <textarea
                type="text"
                id="preview"
                value={preview}
                onChange={onMutate}
                required
              />
              <br/>
              Or
              <br/>
              <button className="current-btn" type="button" onClick={generatePreview}>
                Generate preview
              </button>
            </label>

            <button className="gradient-btn" type="submit">
              Create Edition
            </button>
          </form>
        </main>
      </div>

    </div>
  );
}

export default NewEdition;
