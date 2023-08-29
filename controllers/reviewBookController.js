const mongoose = require("mongoose");
const Book = require("../models/bookModels").default;
const User = require("../models/userModels");

exports.reviewBook = async (req, res) => {
  try {
    // 1- Make sure the user is valid
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "This user doesn't exist" });
    }

    //2- Check if book is available
    const book = await Book.findOne({ bookID: req.body.bookID });
    if (!book) {
      return res.status(400).json({ message: "Book not found" });
    }

    //3- Add the review to the book
    const { reviewerName, rating, comment } = req.body;
    book.reviews.push({ reviewerName, rating, comment });
    await book.save();

    return res
      .status(201)
      .json({ message: "Review added successfully", data: book });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
};
