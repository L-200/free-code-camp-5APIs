require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require("dns")

const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  longVersion: { type: String, required: true },
  shortVersion: { type: Number, required: true, unique: true }
})

const Url = mongoose.model('Url', urlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

function domain_exists(hostname) {
  return new Promise((resolve) => {
    dns.lookup(hostname, (err) => {
      resolve(!err)
    })
  })
}

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res) => {
  const oldUrl = req.body.url;

  try {
    const parsedUrl = new URL(oldUrl);

    const exists = await domain_exists(parsedUrl.hostname);

    if (!exists) {
      return res.json({ error: "Invalid URL" });
    }

    const last = await Url.findOne().sort({ shortVersion: -1 });
    const newUrl = new Url({
      longVersion: oldUrl,
      shortVersion: last ? last.shortVersion + 1 : 1
    });
    await newUrl.save();

    res.json({
      original_url: newUrl.longVersion,
      short_url: newUrl.shortVersion
    });
  } catch (err) {
    console.error(err);
    res.json({ error: "Invalid URL" });
  }
});

app.get('/api/shorturl/:shorturl', async (req, res) => {

  const shortenedUrl = req.params.shorturl;

  const urlFound = await Url.findOne({
    shortVersion: shortenedUrl
  });

  if (!urlFound) {
    return res.json({ error: "URL not found" });
  }

  res.redirect(urlFound.longVersion);
});

if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen(port, function () {
    console.log(`Listening on port ${port}`);
  });
}

module.exports = app;
