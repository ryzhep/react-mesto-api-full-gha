const router = require('express').Router();

const {
  getUserById,
  getUsers,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  userIdValidator,
  userDataValidator,
  userAvatarValidator,
} = require('../middlewares/validator');

router.get('/', getUsers);
router.get('/me', userDataValidator, getCurrentUser);
router.get('/:userId', userIdValidator, getUserById);
router.patch('/me', userDataValidator, updateUser);
router.patch('/me/avatar', userAvatarValidator, updateUserAvatar);

module.exports = router;
