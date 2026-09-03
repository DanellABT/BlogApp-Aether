const { verify } = require('../auth');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/:id/follow', verify, userController.toggleFollow);
router.get('/suggestions', verify, userController.getSuggestions);
router.get('/profile/:username', verify, userController.getProfile);

module.exports = router;