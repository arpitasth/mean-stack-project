const express = require('express');
const multer = require('multer');
const path = require('path');
const { nanoid } = require('nanoid');

const {
  getPosts,
  addPost,
  getPostById,
  updatePost,
  deletePost
} = require('../controllers/PostsController');
const { protectRoutes } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), 'uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, nanoid() + '-' + Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

router
  .route('')
    .get(getPosts)
    .post(protectRoutes, upload.array('postPictures'), addPost);

router
  .route('/:id')
    .get(getPostById)
    .put(protectRoutes, updatePost)
    .delete(protectRoutes, deletePost)

module.exports = router;
