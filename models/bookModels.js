const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const bookSchema = new mongoose.Schema({
    bookName: {
        type: string,
        required: [true, "Enter the book's name!!"],
        trim: true
    },
    bookAuthor: {
        type: string,
        required: [true, "Enter the author's name!!"],
        trim: true
    },
    emailAuthor: {
        type: String,
        required: [true, "Please enter your Email"],
        trim: true,
        unique: true,
        lowercase: true,
    },
    booksSold: {
        type: Number,
    }
})
