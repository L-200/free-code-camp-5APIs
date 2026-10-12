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
  duration: {type: Number, required: true},
  date : {type: Date, default : Date.now}
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

app.post('/api/users/:_id/exercises', async (req, res) => {
  try {
    const user = await User.findById(req.params._id)
    const newExercise = new Exercise({
      userID: user._id,
      description: req.body.description,
      duration: Number(req.body.duration),
      date: req.body.date ? new Date(req.body.date) : new Date()
    });

    await newExercise.save();

    res.json({
      username: user.username,
      description: newExercise.description,
      duration: newExercise.duration,
      date: newExercise.date.toDateString(),
      _id: user._id
    });

  } catch (err) {
    console.log(err);
  }
});

app.get('/api/users/:_id/logs', async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  try {
    const user = await User.findById(_id);
    if (!user) {
      console.log('Usuario não encontrados')
    }

    const filter = { userID: _id };
    if (from || to) {
      filter.date = {};
      if (from) {
        filter.date.$gte = new Date(from);
      }
      if (to) {
        filter.date.$lte = new Date(to);
      }
    }

    query = Exercise.find(filter);
    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const exercises = await query.exec();
    const log = exercises.map(ex => ({
      description: ex.description,
      duration: ex.duration,
      date: ex.date.toDateString()
    }));
    res.json({
      _id: user._id,
      username: user.username,
      count: log.length,
      log
    });
  } catch (err) {
    console.error(err);
  }
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
