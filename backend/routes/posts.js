const express = require('express');

const {
  getPosts,
  addPost,
  getPostById,
  updatePost,
  deletePost,
  getPostsByUser
} = require('../controllers/PostsController');
const { protectRoutes } = require('../middleware/auth');

const router = express.Router();

router
  .route('')
    .get(getPosts)
    .post(protectRoutes, addPost);

router
  .route('/:id')
    .get(getPostById)
    .put(protectRoutes, updatePost)
    .delete(protectRoutes, deletePost)

router
    .route('/my-posts/:id')
      .get(protectRoutes, getPostsByUser)

module.exports = router;
