const Book = require("../models/bookModels").default;
const User = require("../models/userModels");
const Library = require("../models/libraryModel");

exports.displayBook = async (req, res) => {
  // 1- Check if the book is valid
  const book = await Book.findOne({ bookID: req.params.bookID });
  if (!book) {
    return res.status(404).json({ message: "This book is not available." });
  } else {
    //2- Send the book info to the user
    return res.status(200).json({ data: book });
  }
};
exports.displayLibraryBook = async (req, res) => {
  try {
    // 1- Check if the book is valid
    const book = await Library.findOne({ _id: req.params._id }).populate(
      "bookInfo"
    );
    if (!book) {
      return res.status(404).json({ message: "This book is not available." });
    } else {
      // 2- Send the populated book info to the user
      return res.status(200).json({ data: book });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};
