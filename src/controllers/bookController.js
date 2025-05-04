const Book = require('../models/Book');

// Create a new book
const createBook = async (req, res) => {
  try {
    const { title, author, price, rating, coverImage, description, category } = req.body;

    const book = new Book({
      title,
      author,
      price,
      rating,
      coverImage,
      description,
      category
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all books
const getBooks = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    
    const books = await Book.find(query);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single book
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a book
const updateBook = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'author', 'price', 'rating', 'coverImage', 'description', 'category'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    updates.forEach(update => book[update] = req.body[update]);
    await book.save();

    res.json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook
}; 