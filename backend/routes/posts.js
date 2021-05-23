const express = require('express');

const postController = require('../controllers/posts');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('', checkAuth, postController.addProduct);

router.get('',  postController.getProducts);

router.get('/:id', checkAuth, postController.getProductById);

router.put('/:postId', checkAuth, postController.getUpdate);

router.delete('/:postId', checkAuth, postController.getDelete);

module.exports = router;
