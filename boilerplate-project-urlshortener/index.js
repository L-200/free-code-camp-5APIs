require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res) => {
  oldUrl = req.body.url
  var newUrl = new Url({ longVersion: oldUrl, shortVersion: 1 })

  await (newUrl.save())

  res.json({ original_url: newUrl.longVersion, short_url: newUrl.shortVersion })
})


if (require.main === module) {
  app.listen(port, function () {
    console.log(`Listening on port ${port}`);
  });
}

module.exports = app;
