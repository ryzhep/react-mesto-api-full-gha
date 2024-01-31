const express = require('express');
// eslint-disable-next-line no-unused-vars
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const appRouter = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
console.log('test3');
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(cors());
app.use(express.json());

// мидлвар, который обоготит объект реквеста полем бади, когда этот бади будет полностью прочитан

// роутер
/*
app.use((req, res, next) => {
  req.user = {
    _id: '65957b01791a4f2e0e926c84',
    // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
*/
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// роутер
app.use(appRouter);
app.use(errorLogger);

app.use(errors()); // сборка JSON-формата
app.use(errorHandler); // централизолванная обработка ошибок

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
