const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');
const authenticate = require('../middleware/authMiddleware');


router.post('/', controller.create);
router.get('/', authenticate, controller.getUsers)

module.exports = router;