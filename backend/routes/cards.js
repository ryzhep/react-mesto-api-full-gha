const router = require('express').Router();
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

const { validationCard, validationCardId } = require('../middlewares/validator');

router.get('/', getCards);
router.post('/', validationCard, createCard);
router.delete('/:cardId', validationCardId, deleteCardById);
router.put('/:cardId/likes', validationCardId, likeCard);
router.delete('/:cardId/likes', validationCardId, dislikeCard);

module.exports = router;
