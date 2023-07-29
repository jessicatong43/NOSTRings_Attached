import React, { useState, useEffect } from 'react';
import { LightningAddress } from 'alby-tools';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  doc, getDoc, updateDoc, arrayUnion, collection, getDocs, query, orderBy,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import axios from 'axios';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';

function Payment() {
  const [details, setDetails] = useState({ email: '', address: '', price: 0 });
  const [loading, setLoading] = useState(true);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const params = useParams();
  const navigate = useNavigate();

  const fetchLn = async () => {
    try {
      console.log(details.address);
      const ln = new LightningAddress(details.address);

      await ln.fetch();

      const invoice = await ln.requestInvoice({
        satoshi: details.price,
        comment: 'Payment for newsletter',
      });

      if (!invoice.verify) {
        console.log(invoice)
        toast.error('Sorry, we were unable verify the authors address');
        navigate(`/newsletter/${params.newsletterId}`);
      }

      setLoading(false);
      setInvoiceGenerated(true);
      setInvoiceDetails(() => invoice);
      const start = Date.now();

      const interval = setInterval(async () => {
        if (Date.now() - start > 200000) {
          clearInterval(interval);
        }
        const status = await axios.get(`/verifyPayment?verify=${invoice.verify}`);
        console.log(status)
        const {settled} = status.data;
        if (settled) {
          console.log('send email here', details.email)
          clearInterval(interval);
        }
      }, 5000);

      console.log(invoice);
    } catch (err) {
      toast.error('Sorry, we were unable verify the authors address');
      navigate(`/newsletter/${params.newsletterId}`);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      const newsletterRef = doc(db, 'Newsletters', params.newsletterId);
      const editionRef = doc(newsletterRef, 'editions', params.editionId);

      const [docSnap, editionSnap] = await Promise.all([getDoc(newsletterRef), getDoc(editionRef)]);
      let newsletter = {};
      if (docSnap.exists()) {
        newsletter = docSnap.data();
      } else {
        toast.error('Sorry, we were unable to find this newsletter');
        navigate(`/newsletter/${params.newsletterId}`);
      }

      if (editionSnap.exists()) {
        const edition = editionSnap.data();
        setDetails((prevDetails) => ({ ...prevDetails, price: edition.price }));
      } else {
        toast.error('Sorry, we were unable to find this edition');
        navigate(`/newsletter/${params.newsletterId}`);
      }

      const ownerRef = doc(db, 'users', newsletter.creator);
      const ownerSnap = await getDoc(ownerRef);
      if (ownerSnap.exists()) {
        const owner = ownerSnap.data();
        if (owner.payment) {
          setDetails((prevDetails) => ({ ...prevDetails, address: owner.payment }));
          setLoading(false);
        } else {
          navigate(`/newsletter/${params.newsletterId}`);
        }
      } else {
        toast.error('Sorry, we were unable to find payment details');
        navigate(`/newsletter/${params.newsletterId}`);
      }
    };

    fetchDetails();
  }, []);

  const onMutate = (e) => {
    setDetails((prevDetails) => ({ ...prevDetails, email: e.target.value }));
  };

  const handlePayment = () => {
    setLoading(true);
    fetchLn();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invoiceDetails.pr);
    toast.success('Paystring copied!');
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <div>
      {!invoiceGenerated
        ? (
          <div>
            <label>Email: </label>
            <input
              type="text"
              id="email"
              value={details.email}
              onChange={onMutate}
              required
            />
            <button type="button" onClick={handlePayment}>
              Create Invoice
            </button>
          </div>
        )
        : (
          <div>
            Invoice made
          </div>

        )}
    </div>
  );
}

export default Payment;
