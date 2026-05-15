const express = require('express');
const twilio = require('twilio');

const app = express();
app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.post('/webhook', async (req, res) => {
  try {
    const data = req.body;

    const pair   = data.pair   || 'UNKNOWN';
    const signal = data.signal || 'UNKNOWN';
    const tf     = data.tf     || '15M';
    const entry  = parseFloat(data.entry).toFixed(5);
    const sl     = parseFloat(data.sl).toFixed(5);
    const tp     = parseFloat(data.tp).toFixed(5);

    const message = 
`🔔 *${signal} ${pair}*
⏱ Timeframe: ${tf}
📍 Entry: ${entry}
🛑 Stop Loss: ${sl}
✅ Take Profit: ${tp}`;

    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${process.env.MY_PHONE_NUMBER}`,
      body: message
    });

    res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
