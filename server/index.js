require('dotenv').config();
const path = require('path');
const compression = require('compression')

const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(compression());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../client/dist')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server available at http://localhost${PORT}`);
});
