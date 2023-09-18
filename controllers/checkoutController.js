const Book = require("../models/bookModels").default;
const User = require("../models/userModels");
const Checkout = require("../models/checkoutModel");
const generateUniqueId = require("generate-unique-id");

exports.checkout = async (req, res) => {
  try {
    // 1- Make sure the user is valid
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "This user doesn't exist" });
    }

    // 2- Check if the book is valid
    const book = await Book.findOne({ bookID: req.body.bookID });
    if (!book) {
      return res.status(404).json({ message: "This book is not available." });
    }

    //3- Checkout

    const id1 = generateUniqueId({
      length: 18,
      useLetters: false,
    });

    const checkoutDate = new Date();

    try {
      const newCheckout = await Checkout.create({
        checkoutID: id1,
        bookID: req.params.bookID,
        email: req.body.email,
        country: req.body.country,
        city: req.body.city,
        streetName: req.body.streetName,
        floor: req.body.floor,
        phoneNumber: req.body.phoneNumber,
        email_checkout: req.body.email_checkout,
        notesCheckout: req.body.notesCheckout,
        checkoutDate: checkoutDate,
      });
      user.userCart.push(newCheckout._id);
      await user.save();
      return res
        .status(200)
        .json({ message: "Checkout Successfull", data: true });
    } catch (error) {
      console.error(error);
      return res.status(404).json({ message: "Checkout Not Successfull" });
    }
  } catch (error) {
    console.error(error);
  }
};
