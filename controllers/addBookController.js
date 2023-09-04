const mongoose = require("mongoose");
const Book = require("../models/bookModels").default;
const User = require("../models/userModels");
const generateUniqueId = require("generate-unique-id");

exports.addBook = async (req, res) => {
  try {
    // 1- Make sure the user is valid
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "This user doesn't exist" });
    }

    // 2- Check if the book is already in library
    const checkBook = await Book.findOne({
      bookName: req.body.bookName,
      bookAuthor: req.body.bookAuthor,
    });
    if (checkBook) {
      return res
        .status(409)
        .json({ message: "This book is already available." });
    }

    // 3- Create a new book

    const releaseDate = new Date();

    const id1 = generateUniqueId({
      length: 12,
      useLetters: false,
    });

    const newBook = await Book.create({
      bookID: id1,
      bookCover: req.body.bookCover,
      bookName: req.body.bookName,
      bookAuthor: req.body.bookAuthor,
      bookGenre: req.body.bookGenre,
      bookDescription: req.body.bookDescription,
      emailAuthor: req.body.emailAuthor,
      bookPrice: req.body.bookPrice,
      bookQuantity: req.body.bookQuantity,
      releaseDate: releaseDate,
    });

    let msg = "Book added successfully!!";

    // Add the number of books uploaded to the user model
    user.booksUploaded += 1;
    await user.save();
    res.status(201).json({ message: msg, data: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
