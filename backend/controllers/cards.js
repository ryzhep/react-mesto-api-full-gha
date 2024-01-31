const { CastError, ValidationError } = require('mongoose').Error;
const CardModel = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const { CREATED_201 } = require('../utils/constants');

// ВСЕ КАРТОЧКИ
const getCards = (req, res, next) => {
  CardModel.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// СОЗДАНИЕ КАРТОЧКИ
const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const { _id: userId } = req.user;
  return CardModel.create({ name, link, owner: userId })
    .then((card) => res.status(CREATED_201).json(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(' ');
        next(new BadRequestError(`Некорректные данные: ${errorMessage}`));
      } else {
        next(err);
      }
    });
};

// УДАЛЕНИЕ КАРТОЧКИ
const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  CardModel.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      }
      if (userId !== card.owner.toString()) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      return CardModel.deleteOne(card).then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

// ПОСТАВИТЬ ЛАЙК
const likeCard = (req, res, next) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new BadRequestError('Некорректный id карточки'));
      }
      return next(err);
    });
};
// УБРАТЬ ЛАЙК
const dislikeCard = (req, res, next) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,

    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new BadRequestError('Некорректный id карточки'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
