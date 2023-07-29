require('dotenv').config();
const path = require('path');
const compression = require('compression');
const axios = require('axios');
const cors = require('cors');

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

app.get('*', (reg, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server available at http://localhost${PORT}`);
});
