const express = require('express');
const router = express.Router();
const { createBook, getBooks, getBook, updateBook, deleteBook } = require('../controllers/bookController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');

// Create a book (protected route)
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('rating').isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  body('coverImage').notEmpty().withMessage('Cover image URL is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required')
], createBook);

// Get all books (public route)
router.get('/', getBooks);

// Get a single book (public route)
router.get('/:id', getBook);

// Update a book (protected route)
router.patch('/:id', auth, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('author').optional().notEmpty().withMessage('Author cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  body('coverImage').optional().notEmpty().withMessage('Cover image URL cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty')
], updateBook);

// Delete a book (protected route)
router.delete('/:id', auth, deleteBook);

module.exports = router; 