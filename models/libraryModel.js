const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema({
  bookInfo: {
    type: ObjectId,
    ref: "Book",
    required: true,
  },
  bookQuantity: {
    type: Number,
    default: 1,
  },
  formatBook: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Library", cartSchema);
