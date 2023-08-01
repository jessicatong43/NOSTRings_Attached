require('dotenv').config();
const path = require('path');
const compression = require('compression');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(compression());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '../client/dist')));

const config = new Configuration({
  apiKey: process.env.OPEN_AI_APIKEY,
});
const openai = new OpenAIApi(config);

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

// app.post('/deliver', async (req, res) => {
//   try {
//     const data = await resend.emails.send({
//       from: 'Acme <onboarding@resend.dev>',
//       to: [req.body.email],
//       subject: 'hello world',
//       html: '<strong>it works!</strong>',
//     });
//     res.status(200).json({ data });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });

app.post('/summary', async (req, res) => {
  try {
    let { text } = req.body;
    text = text.substring(0, 2000);

    // const generation = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: [{role: 'system', content: 'You run marketing for a digital newsletter.' }, {role: 'user', content: `Given the latest edition below write a short and catchy summary to entice readers to buy the newsletter without giving too much away: \n ${text}`}],
    //   temperature: 0.6,
    //   max_tokens: 3500,
    // });

    const options = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You run marketing for a digital newsletter.',
        },
        {
          role: 'user',
          content: `Given the latest edition below write a short and catchy summary to entice readers to buy the newsletter without giving too much away: \n ${text}`,
        },
      ],
    };

    const metador = await axios.post('https://matador-ai.replit.app/v1/chat/completions', options);
    console.log(metador)

    res.status(200).json(generation.data.choices[0].message.content);
  } catch (error) {
    console.log(error);
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
