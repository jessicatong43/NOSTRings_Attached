require('dotenv').config();
const path = require('path');
const compression = require('compression');
const axios = require('axios');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(compression());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/verifyPayment', (req, res) => {
  axios.get(req.query.verify).then((apiData) => {
    res.send({
      settled: apiData.data.settled,
    });
  }).catch((err) => {
    console.log(err);
    res.status(404).send('Error verifying payment');
  });
});

app.post('/deliver', async (req, res) => {
  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [req.body.email],
      subject: 'hello world',
      html: '<strong>it works!</strong>',
    });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get('*', (reg, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server available at http://localhost${PORT}`);
});
