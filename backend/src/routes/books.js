const express = require('express');
const authMiddleware = require('../middleware/auth');
const { getBooks, getBookById, createBook } = require('../controllers/bookController');

const router = express.Router();

router.get('/', authMiddleware, getBooks);
router.get('/:id', authMiddleware, getBookById);
router.post('/', authMiddleware, createBook);

module.exports = router;
