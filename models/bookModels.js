const mongoose = require("mongoose");
const bookGenres = Object.freeze([
  "Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Thriller",
  "Horror",
  "Romance",
  "Historical Fiction",
  "Adventure",
  "Young Adult",
  "Children's",
  "Non-fiction",
  "Biography",
  "Autobiography",
  "Self-help",
  "Travel",
  "Cooking",
  "Science",
  "History",
  "Philosophy",
  "Poetry",
  "Religion",
  "Graphic Novel",
  "Comics",
  "Dystopian",
  "Music",
]);
exports.bookGenres = bookGenres;

function NonEmptyArray(v) {
  return Array.isArray(v) && v.length > 0;
}

function isGenere(v) {
  for (let i = 0; i < v.length; i++) {
    if (!bookGenres.includes(v[i])) {
      return false;
    }
  }
  return true;
}
exports.isGenere = isGenere;

const bookSchema = new mongoose.Schema({
  bookID: {
    type: Number,
    required: true,
    unique: true,
  },
  bookCover: {
    type: String,
  },
  bookName: {
    type: String,
    required: [true, "Enter the book's name!!"],
    trim: true,
  },
  bookAuthor: {
    type: String,
    required: [true, "Enter the author's name!!"],
    trim: true,
  },
  bookGenre: {
    type: [String],
    required: true,
    validate: (v) => NonEmptyArray(v) && isGenere(v),
  },
  emailAuthor: {
    type: String,
    trim: true,
    lowercase: true,
  },
  booksSold: {
    type: Number,
  },
  bookPrice: {
    type: String,
    required: [true, "Enter the book's price."],
  },
});

module.exports.default = mongoose.model("Book", bookSchema);
