const express = require('express');
const twilio = require('twilio');
const app = express();
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.post('/webhook', (req, res) => {
  const message = req.body.message || 'Signal received';
  
  client.messages.create({
    from: 'whatsapp:' + process.env.TWILIO_WHATSAPP_FROM,
    to: 'whatsapp:' + process.env.MY_PHONE_NUMBER,
    body: message
  });
  
  res.status(200).send('OK');
});

app.get('/', (req, res) => res.send('Jay Trading Signals Running!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
