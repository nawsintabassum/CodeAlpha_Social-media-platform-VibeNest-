const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/toggle', verifyToken, likeController.toggleLike);

module.exports = router;