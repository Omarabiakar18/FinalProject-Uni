const User = require("../../models/userModels.js");
const Item = require("../../models/cartModels");
const Book = require("../../models/bookModels").default;

exports.displayItemsInCart = async (req, res) => {
  try {
    // 1- Make sure the user is valid
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "This user doesn't exist" });
    }

    await user.populate({ path: "userCart", populate: { path: "bookInfo" } });

    // 2- Check if cart is empty
    const cartEmpty = "Your cart is empty.";
    const cart = "Your cart items.";

    const cartItems = user.userCart;

    if (cartItems.length === 0) {
      return res.status(200).json({ message: cartEmpty, data: [] });
    }

    // 3- Cart contains items
    return res.status(200).json({ message: cart, data: cartItems });
  } catch (error) {
    console.error(error);
  }
};
