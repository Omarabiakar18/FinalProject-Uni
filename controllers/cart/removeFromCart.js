const User = require("../../models/userModels.js");
const Item = require("../../models/cartModels");
const Book = require("../../models/bookModels").default;

exports.removeFromCart = async (req, res) => {
  try {
    // 1- Make sure the user is valid
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "This user doesn't exist" });
    }

    // 2- Check if item is in the cart
    const bookToRemove = req.body.itemID;
    const item = await Item.findById(bookToRemove);
    if (!item) {
      return res.status(404).json({ message: "This book is not in the cart." });
    }

    // 3- Remove from cart if it exists
    await User.updateOne({ _id: user._id }, { $pull: { userCart: item._id } });
    await Item.deleteOne({ bookInfo: bookToRemove });

    return res
      .status(200)
      .json({ message: "Item removed successfully", data: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};
