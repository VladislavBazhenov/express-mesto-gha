const express = require('express');

const cardRouter = express.Router();
const cardSchema = require('../models/card');
const {
  errorCodeInvalidData,
  errorCodeNotFound,
  errorCodeDefault,
  errorMessage,
} = require('../utils/constantsErr');

cardRouter.get('/', (req, res) => {
  cardSchema
    .find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(errorCodeDefault).send({ message: errorMessage }));
});

cardRouter.post('/', (req, res) => {
  const { name, link } = req.body;
  cardSchema
    .create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(errorCodeInvalidData)
          .send({ message: 'Invalid data' });

        return;
      }
      res.status(errorCodeDefault)
        .send({ message: errorMessage });
    });
});

cardRouter.delete('/:cardId', (req, res) => {
  const { cardId } = req.params;
  cardSchema
    .findByIdAndRemove(cardId)
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(errorCodeInvalidData)
          .send({ message: 'Invalid card id passed' });

        return;
      }

      if (err.name === 'DocumentNotFoundError') {
        res
          .status(errorCodeNotFound)
          .send({ message: `Card Id: ${cardId} is not found` });

        return;
      }

      res
        .status(errorCodeDefault)
        .send({ message: errorMessage });
    });
});

cardRouter.put('/:cardId/likes', (req, res) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(errorCodeNotFound)
          .send({ message: `Card Id: ${req.params.cardId} is not found` });

        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
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

cardRouter.delete('/:cardId/likes', (req, res) => {
  cardSchema.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(errorCodeNotFound)
          .send({ message: `Card Id: ${req.params.cardId} is not found` });
      }
      return res.status(200)
        .send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
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

module.exports = cardRouter;
