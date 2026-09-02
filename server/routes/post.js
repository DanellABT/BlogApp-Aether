const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const { verify } = require('../auth');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getSinglePost);

// Protected routes
router.post('/', verify, postController.createPost);
router.put('/:id', verify, postController.updatePost);
router.delete('/:id', verify, postController.deletePost);
router.post('/:id/comments', verify, postController.addComment);

module.exports = router;