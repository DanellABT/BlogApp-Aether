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
router.post('/:id/like', verify, postController.toggleLike);
router.get('/feed/following', verify, postController.getFollowingPosts);

module.exports = router;