const User = require("../../models/userModels.js");
const Item = require("../../models/cartModels");
const Book = require("../../models/bookModels").default;

exports.updateQuantity = async (req, res) => {
  try {
    // 1- Make sure the user is valid
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "This user doesn't exist" });
    }
    await user.populate({ path: "userCart", populate: { path: "bookInfo" } });
    //console.log(user.userCart);
    // 2- Check if item is in the cart
    const item = user.userCart.find(
      (item) => item.bookInfo.bookID === req.body.bookID
    );
    if (!item) {
      return res.status(404).json({ message: "This book is not in the cart." });
    }

    //3- Update quantity
    const itemUpdated = "Cart updated.";

    item.bookQuantity = req.body.bookQuantity;
    await item.save();
    return res.status(200).json({ message: itemUpdated, data: item });
  } catch (error) {
    console.error(error);
  }
};
