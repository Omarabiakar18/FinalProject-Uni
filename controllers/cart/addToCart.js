const User = require("../../models/userModels.js");
const Item = require("../../models/cartModels");
const Book = require("../../models/bookModels").default;

const generateUniqueId = require("generate-unique-id");

exports.addToCart = async (req, res) => {
  try {
    // 1- Make sure the user is valid
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "This user doesn't exist" });
    }

    // 2- Check if the book is valid
    const book = await Book.findOne({ bookID: req.params.bookID });
    if (!book) {
      return res.status(404).json({ message: "This book is not available." });
    }

    //3- If ok --> Add to cart
    const itemAdded = "Added to cart.";
    const itemNotAdded = "Cant add this item to cart.";

    const id1 = generateUniqueId({
      length: 18,
      useLetters: false,
    });
    //console.log(user.userCart);
    let itemFound = null;
    let formatFound = null;
    let bookFormat = req.body.bookFormat;

    for (let i = 0; i < user.userCart.length; i++) {
      const item = await Item.findById(user.userCart[i]);
      if (item && item.bookInfo.equals(book._id)) {
        itemFound = item;
        if (item.formatBook === bookFormat) {
          formatFound = item;
          break;
        }
      }
    }
    if (itemFound && formatFound) {
      itemFound.bookQuantity += req.body.bookQuantity;
      await itemFound.save();
      return res.status(200).json({ message: itemAdded, data: itemFound });
    } else {
      try {
        const newItem = await Item.create({
          itemID: id1,
          bookInfo: book._id,
          bookQuantity: req.body.bookQuantity,
          formatBook: req.body.formatBook,
        });
        user.userCart.push(newItem._id);
        await user.save();
        return res.status(200).json({ message: itemAdded, data: newItem });
      } catch (error) {
        console.error(error);
        return res.status(404).json({ message: itemNotAdded });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
