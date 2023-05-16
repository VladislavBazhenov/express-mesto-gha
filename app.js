const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/index');
const cardsRouter = require('./routes/index');

const PORT = 3000;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb ', {})
  .then(() => { console.log('Connect'); })
  .catch((error) => { console.log(error); });

app.use(bodyParser.json());
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '64613a7a957a441d06a7fabc',
  };

  next();
});

app.listen(PORT, () => {
  console.log(`Listining on port ${PORT}`);
});
