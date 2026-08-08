const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/toggle', verifyToken, followController.toggleFollow);

module.exports = router;