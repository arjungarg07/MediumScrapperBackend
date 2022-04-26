const router = require('express').Router();

const postController = require('../controllers/postController');

router.get('/posts/:tag',postController.getPostsByTag.bind(postController));

module.exports = router;