const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username : {type: String, required: true},
})

const User = mongoose.model('User', userSchema);

const exerciseSchema = new mongoose.Schema({
  userID: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  description : {type: String, required: true},
  duration : {type: String, required: true},
  date : {type: Date, default : Date.now, required: true}
})

const Exercise = mongoose.model('Exercise', exerciseSchema)


app.use(express.urlencoded({ extended: true }));

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req, res) => {
  const username = req.body.username;

  try {
    const newUser = new User({ username });
    await newUser.save();

    res.json({
      _id: newUser._id,
      username: newUser.username
    });
  } catch (err) {
    console.log(err);
  }
});

app.get('/api/users', async (req, res) => {
  const users = await User.find({}, 'username');
  res.json(users);
});

if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app.listen(process.env.PORT, function () {
    console.log(`Listening on port ${process.env.PORT}`);
  });
}

module.exports = app;
