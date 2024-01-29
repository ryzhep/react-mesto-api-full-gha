const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { CastError, ValidationError } = require('mongoose').Error;
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const UserModel = require('../models/user');
const { CREATED_201 } = require('../utils/constants');

const NotError = 200;

// ВСЕ ПОЛЬЗОВАТЕЛИ
// eslint-disable-next-line consistent-return
const getUsers = (req, res, next) => {
  UserModel.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// ПОЛЬЗОВАИТЕЛЬ ПО АЙДИ
const getUserById = (req, res, next) => {
  const { userId } = req.params;

  return UserModel.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};
// возвращает информацию о текущем пользователе
const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  UserModel.findById(_id)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.status(NotError).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new BadRequestError('Некорректный id пользователя'));
      }
      return next(err);
    });
};

// СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      UserModel.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then(() => res.status(CREATED_201).json({
          name,
          about,
          avatar,
          email,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            return next(new ConflictError('Такой email уже существует')); // 409
          }
          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Ошибка валидации'));
          }
          return next(err);
        });
    })
    .catch(next);
};

// ОБНОВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ
const updateUser = (req, res, next) => {
  const owner = req.user._id;
  return UserModel.findByIdAndUpdate(
    owner,
    { name: req.body.name, about: req.body.about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join(', ');
        next(new BadRequestError(`Некорректные данные: ${errorMessage}`));
      } else {
        next(err);
      }
    });
};
// ОБНОВЛЕНИЕ АВАТАРА ПОЛЬЗОВАТЕЛЯ
const updateUserAvatar = (req, res, next) => {
  const owner = req.user._id;

  UserModel.findByIdAndUpdate(
    owner,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super_secret_key',
        { expiresIn: '7d'},
        null,
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  login,
  createUser,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
};
