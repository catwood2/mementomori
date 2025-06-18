const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// VAPID keys from your setup
webpush.setVapidDetails(
  'mailto:you@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Save subscription endpoint (called from client)
app.post('/api/save-subscription', (req, res) => {
  // persist req.body (the PushSubscription JSON) in your DB
  // ...
  res.sendStatus(201);
});

// Airtable webhook -> send notification
app.post('/api/notify-new-quote', async (req, res) => {
  const payload = req.body; // Airtable sends record fields
  const allSubs = /* load subscriptions from your DB */[];
  const notification = {
    title: 'New Quote Added',
    body: payload.fields.Quote.slice(0, 100) + '…'
  };

  await Promise.all(allSubs.map(sub =>
    webpush.sendNotification(sub, JSON.stringify(notification)).catch(console.error)
  ));
  res.sendStatus(200);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🔔 Push handler listening on ${port}`));