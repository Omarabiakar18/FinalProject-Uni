const Book = require("../models/bookModels").default;
const User = require("../models/userModels");
const Item = require("../models/cartModels");
const generateUniqueId = require("generate-unique-id");

exports.addBook = async (req, res) => {
  try {
    // 1- Make sure the user is valid
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "This user doesn't exist" });
    }

    // 2- Check if the book is already is valid
    const book = await User.find({ bookID: req.body.bookID }); //check if quantioty is > 0
    if (!book) {
      return res
        .status(404)
        .json({ message: "This book is not available anymore." });
    }

    //3- If ok --> Add to cart

    const id1 = generateUniqueId({
      length: 12,
      useLetters: false,
    });

    const newItem = await Item.create({
      itemID: id1,
      //Object id from book model
    });
  } catch (error) {
    console.log(error);
  }
};
