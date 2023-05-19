const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/index');
const cardsRouter = require('./routes/index');
const router = require('./routes/index');

const PORT = 3000;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb ', {})
  .then(() => { console.log('Connect'); })
  .catch((error) => { console.log(error); });

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '646380a1d056d583f9e5d6a0',
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Listining on port ${PORT}`);
});
