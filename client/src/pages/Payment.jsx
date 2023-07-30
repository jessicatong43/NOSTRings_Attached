import React, { useState, useEffect, useId } from 'react';
import { LightningAddress } from 'alby-tools';
import { useNavigate, useParams } from 'react-router-dom';
import {
  doc, getDoc, updateDoc, arrayUnion,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import axios from 'axios';
import QRCode from 'react-qr-code';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';

function Payment() {
  const [details, setDetails] = useState({
    email: '', address: '', price: 0, source: '',
  });
  const [newsletterTitle, setNewsletterTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const params = useParams();
  const navigate = useNavigate();
  const emailId = useId();

  const fetchLn = async () => {
    try {
      const ln = new LightningAddress(details.address);

      await ln.fetch();

      const invoice = await ln.requestInvoice({
        satoshi: details.price,
        comment: 'Payment for newsletter',
      });

      if (!invoice.verify) {
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

        const { settled } = status.data;
        if (settled) {
          const editionRef = doc(db, 'Newsletters', params.newsletterId, 'editions', params.editionId);
          updateDoc(editionRef, {
            paid: arrayUnion(details.email),
          });

          const mail = await axios.post('/deliver', {
            email: details.email,
            newsletter: details.source,
          });

          if (mail?.data?.data?.id) {
            toast.success('Payment received, please check your inbox');
            setSuccess(true);
          } else {
            toast.error('Error processing your payment. Please contact support');
          }

          clearInterval(interval);
        }
      }, 5000);
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
        setNewsletterTitle(newsletter.title);
      } else {
        toast.error('Sorry, we were unable to find this newsletter');
        navigate(`/newsletter/${params.newsletterId}`);
      }

      if (editionSnap.exists()) {
        const edition = editionSnap.data();
        setDetails((prevDetails) => ({
          ...prevDetails,
          price: edition.price,
          source: edition.source,
        }));
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
    navigator.clipboard.writeText(invoiceDetails.paymentRequest);
    toast.success('Paystring copied!');
  };

  if (loading) {
    return <Spinner />;
  }

  if (success) {
    return (
      <div>
        <header className="center invoice-header">
          <h3>Thank yoy for your purchase!</h3>
        </header>
        <main>
          <button type="button" className="gradient-btn" onClick={() => navigate('/')}>
            Home
          </button>
          <button type="button" className="gradient-btn" onClick={() => navigate(`/newsletter/${params.newsletterId}`)}>
            Back to
            {' '}
            {newsletter.title}
          </button>
        </main>
      </div>
    );
  }
  return (
    <div>
      {!invoiceGenerated
        ? (
          <div>
            <main className="grid">
              <p className="invoice-header color-text">Please add an email that you want the newsletter sent to</p>
              <label className="color-text" htmlFor={emailId}>
                Email: &nbsp;
                <input
                  type="text"
                  id={emailId}
                  placeholder="Email address"
                  value={details.email}
                  onChange={onMutate}
                  required
                />
              </label>

              <button className="gradient-btn" type="button" onClick={handlePayment}>
                Create Invoice
              </button>
            </main>

          </div>
        )
        : (
          <div>
            <header className="center invoice-header">
              <h3 className="color-text">Payment invoice has been generated</h3>
            </header>
            <main className="grid">
              <button type="button" className="gradient-btn" onClick={copyToClipboard}>Copy pay string</button>
              <p className="invoice-header color-text">Or scan here:</p>
              <QRCode
                size={256}
                style={{ height: 'auto', maxWidth: '50vw', width: '50vh' }}
                value={invoiceDetails.paymentRequest}
                viewBox="0 0 256 256"
              />
            </main>
          </div>

        )}
    </div>
  );
}

export default Payment;
