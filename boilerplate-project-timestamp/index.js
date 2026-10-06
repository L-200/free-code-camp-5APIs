// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date?", (req, res) => {
  const { date } = req.params;

  let parsed;
  if (!date) {
    parsed = new Date();
  } else if (/^\d+$/.test(date)) {
    parsed = new Date(Number(date));
  } else {
    parsed = new Date(date);

  
    const iso = date.match(/^(\d{4}-\d{2}-\d{2})/);
    if (iso && !isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) !== iso[1]) {
      return res.json({ error: "Invalid Date" });
    }
  }

  if (isNaN(parsed.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  res.json({ unix: parsed.getTime(), utc: parsed.toUTCString() });
});



// Listen on port set in environment variable or default to 3000
if (require.main === module) {
  var listener = app.listen(process.env.PORT || 3000, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
}

module.exports = app;

