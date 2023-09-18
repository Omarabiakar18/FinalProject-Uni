const mongoose = require("mongoose");
const bookGenres = Object.freeze([
  "Adventure",
  "Autobiography",
  "Adult",
  "Biography",
  "Children's",
  "Comics",
  "Contemporary",
  "Cooking",
  "Crime",
  "Dark",
  "Dystopian",
  "Electropop",
  "Fantasy",
  "Fiction",
  "Graphic Novel",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Non-fiction",
  "Philosophy",
  "Poetry",
  "Religion",
  "Romance",
  "R&B",
  "Science",
  "Science Fiction",
  "Self-help",
  "Thriller",
  "Travel",
  "Young Adult",
]);

exports.bookGenres = bookGenres;

const bookFormat = Object.freeze([
  "Paperback",
  "Hard Cover",
  "AudioBook",
  "e-Book",
]);
exports.bookFormat = bookFormat;

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

function isFormat(f) {
  return bookFormat.includes(f);
}
exports.isFormat = isFormat;

const bookSchema = new mongoose.Schema({
  bookID: {
    type: Number,
    required: true,
    unique: true,
  },
  bookCover: {
    type: String,
    required: [true, "Enter a Book Cover!!"],
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
  bookDescription: {
    type: String,
    maxlength: 500,
  },
  bookGenre: {
    type: [String],
    required: true,
    validate: (v) => NonEmptyArray(v) && isGenere(v),
  },
  bookFormat: {
    type: [
      {
        format: {
          type: String,
          validate: (f) => isFormat(f),
          required: true,
        },
        price: {
          type: Number,
          validate: (f) => f > 0,
          required: true,
        },
      },
    ],
    validate: (v) => NonEmptyArray(v),
  },
  emailAuthor: {
    type: String,
    trim: true,
    lowercase: true,
  },
  amountSold: {
    type: String,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  reviews: [
    {
      reviewerName: String,
      rating: Number,
      comment: String,
    },
  ],
});

bookSchema.index({
  bookName: "text",
  bookAuthor: "text",
});

module.exports.default = mongoose.model("Book", bookSchema);
