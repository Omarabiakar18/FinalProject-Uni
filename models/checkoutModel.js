const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema({
  checkoutID: {
    type: Number,
    required: true,
    unique: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: [true, "Enter a city!!"],
    trim: true,
  },
  streetName: {
    type: String,
    required: [true, "Enter a street name!!"],
    trim: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  email_checkout: {
    type: String,
    trim: true,
    lowercase: true,
  },
  notesCheckout: {
    type: String,
  },
  checkoutDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Checkout", checkoutSchema);
