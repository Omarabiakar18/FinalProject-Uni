const mongoose = require("mongoose");
const Book = require("../models/bookModels").default;
const User = require("../models/userModels");
const { isGenere } = require("../models/bookModels");

exports.search = async (req, res) => {
  try {
    if (req.body.query == undefined || typeof req.body.query != "string") {
      return res.status(400).json({ message: "Query not found." });
    }

    //2- Add a query to search for the book name in the database
    const searchEntered = req.body.query.toString().trim();
    let bookFound = "Book found.";
    const bookNotFound = "This book is not found.";

    //const searchBook = new RegExp(`.*${searchEntered}.*`, "i");

    //console.log(search);
    //console.log(isGenere);
    const filters = req.body.filters;
    if (!Array.isArray(filters) || !isGenere(filters)) {
      return res.status(400).json({ message: "Unknown Filter" });
    }

    if (searchEntered === "" && filters.length === 0) {
      return res
        .status(404)
        .json({ message: "Enter a search query or filter." });
    }

    const addText =
      searchEntered.length === 0 ? {} : { $text: { $search: searchEntered } };
    const addFilters =
      filters.length === 0 ? {} : { bookGenre: { $in: filters } };

    const books = await Book.find({
      ...addText,
      ...addFilters,
    }).limit(13);
    if (books.length === 0) {
      return res.status(404).json({ message: bookNotFound });
    } else {
      return res.status(200).json({ message: bookFound, data: books });
    }
  } catch (error) {
    console.error(error);
  }
};
