const mongoose = require("mongoose");
const Book = require("../models/bookModels").default;
const User = require("../models/userModels");
const { isGenere } = require("../models/bookModels");

exports.search = async (req, res) => {
  try {
    // 1- Make sure the user is valid
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "This email doesn't exist" });
    }

    //2- Add a query to search for the book name in the database
    const bookNameEntered = req.body.bookName;
    let bookFound = "Book found.";

    const search = new RegExp(`.*${bookNameEntered}.*`, "i");
    //console.log(search);
    //console.log(isGenere);
    const filters = req.body.filters;
    if (!Array.isArray(filters) || !isGenere(filters)) {
      return res.status(404).json({ message: "Unknown Filter" });
    }

    if (bookNameEntered === "" && filters.length === 0) {
      return res
        .status(404)
        .json({ message: "Enter a search query or filter." });
    }

    const addFilters =
      filters.length === 0 ? {} : { bookGenre: { $in: filters } };
    //console.log(Book);
    const books = await Book.find({
      bookName: { $regex: search },
      ...addFilters,
    }).limit(13);
    if (books.length === 0) {
      return res.status(404).json({ message: "This book is not found." });
    } else {
      return res.status(200).json({ message: bookFound, data: books });
    }
  } catch (error) {
    console.log(error);
  }
};
