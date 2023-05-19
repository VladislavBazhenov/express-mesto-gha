const express = require('express');

const usersRouter = express.Router();
const User = require('../models/user');
const {
  errorCodeInvalidData,
  errorCodeNotFound,
  errorCodeDefault,
  errorMessage,
} = require('../utils/constantsErr');

usersRouter.get('/', (req, res) => {
  User
    .find({})
    .then((users) => res.send(users))
    .catch(() => res.status(errorCodeDefault).send({ message: errorMessage }));
});

usersRouter.post('/', (req, res) => {
  const { name, about, avatar } = req.body;

  const newUser = { name, about, avatar };
  User.create(newUser)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(errorCodeInvalidData)
          .send({ message: 'Invalid data' });

        return;
      }

      res
        .status(errorCodeDefault)
        .send({ message: errorMessage });
    });
});

usersRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(errorCodeInvalidData)
          .send({ message: 'Invalid data' });

        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res
          .status(errorCodeNotFound)
          .send({ message: `User Id: ${id} is not found` });

        return;
      }
      res
        .status(errorCodeDefault)
        .send({ message: errorMessage });
    });
});

usersRouter.patch('/me', (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res
          .status(errorCodeInvalidData)
          .send({ message: 'Invalid user' });

        return;
      }

      res
        .status(errorCodeDefault)
        .send({ message: errorMessage });
    });
});

usersRouter.patch('/me/avatar', (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(errorCodeInvalidData)
          .send({ message: 'Invalid user' });

        return;
      }

      if (err.name === 'DocumentNotFoundError') {
        res
          .status(errorCodeNotFound)
          .send({ message: `User Id: ${req.user._id} is not found` });

        return;
      }

      res
        .status(errorCodeDefault)
        .send({ message: errorMessage });
    });
});

module.exports = usersRouter;
