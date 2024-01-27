const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');

const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/NotFoundError');
const { createUser, login } = require('../controllers/users');
const {
  createUserValidator,
  loginValidator,
} = require('../middlewares/validator');

// роуты, которые не требуют авторизации (регистрация и логин)
router.post('/signup', createUserValidator, createUser); // роутер для регистрации
router.post('/signin', loginValidator, login); // роутер для авторизации

router.use(auth);
router.use('/users', usersRouter); // роутеры для пользователей
router.use('/cards', cardsRouter); // роутеры для карточек

// роут для запросов по несуществующим URL

router.use('*', (req, res, next) => {
  next(
    new NotFoundError(
      'Страница не найдена. Проверьте правильность ввода URL и метод запроса',
    ),
  );
});

module.exports = router;
