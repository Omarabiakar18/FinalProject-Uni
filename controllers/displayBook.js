const Book = require("../models/bookModels").default;
const User = require("../models/userModels");

exports.displayBook = async (req, res) => {
  // 1- Check if the book is valid
  const book = await Book.findOne({ bookID: req.body.bookID });
  if (!book) {
    return res.status(404).json({ message: "This book is not available." });
  } else {
    //2- Send the book info to the user
    return res.status(200).json({ data: book });
  }
};
