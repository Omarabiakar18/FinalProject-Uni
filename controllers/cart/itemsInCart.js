const User = require("../../models/userModels.js");
const Item = require("../../models/cartModels");
const Book = require("../../models/bookModels").default;

exports.displayItemsInCart = async (req, res) => {
  try {
    // 1- Make sure the user is valid
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Signup or LogIn to display your cart" });
    }

    await user.populate({ path: "userCart", populate: { path: "bookInfo" } });

    // 2- Check if cart is empty
    const cartEmpty = "Your cart is empty.";
    const cart = "Your cart items.";

    const cartItems = user.userCart;

    if (cartItems.length === 0) {
      return res
        .status(200)
        .json({ message: cartEmpty, data: [], totalAmount: 0 }); // Add totalAmount property with 0 for empty cart
    }

    // 3- Cart contains items
    // Calculate the total amount of money for items in the cart
    const totalAmount = cartItems.reduce((total, item) => {
      return total + item.bookInfo.price * item.quantity;
    }, 0);

    return res
      .status(200)
      .json({ message: cart, data: cartItems, totalAmount }); // Include totalAmount in the response
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "An error occurred." });
  }
};
