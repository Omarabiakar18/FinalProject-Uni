const Book = require("../models/bookModels").default;
const User = require("../models/userModels");

exports.wishList = async (req, res) => {
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

    //3- Add to Wish List
    try {
      user.wishList.push(book._id);
      await user.save();

      return res
        .status(200)
        .json({ message: "Added to Wish List", data: user.wishList });
    } catch (error) {
      console.error(error);
      return res.status(404).json({ message: "Unable to add to Wish List" });
    }
  } catch (error) {
    console.error(error);
  }
};

exports.wishListDisplay = async (req, res) => {
  try {
    // 1- Make sure the user is valid
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "This user doesn't exist" });
    }

    // 2- Populate the wishList with book data
    const populatedUser = await User.findOne({
      email: req.body.email,
    }).populate("wishList");

    // 3- Extract the populated wishList with book info
    const populatedWishList = populatedUser.wishList.map((item) => ({
      bookID: item.bookID,
      bookCover: item.bookCover,
      bookName: item.bookName,
      bookAuthor: item.bookAuthor,
    }));

    return res.status(200).json({
      message: "Successfully Retrieved Wish List",
      data: populatedWishList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

exports.removeFromWishList = async (req, res) => {
  try {
    // 1- Make sure the user is valid
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "This user doesn't exist" });
    }

    // 2- Check if item is in the wish list
    const bookIdToRemove = req.body.bookID;
    const isBookInWishList = user.wishList.includes(bookIdToRemove);

    if (!isBookInWishList) {
      return res
        .status(404)
        .json({ message: "This book is not in the wish list." });
    }

    // 3- Remove from wish list if it exists
    await User.updateOne(
      { _id: user._id },
      { $pull: { wishList: bookIdToRemove } }
    );

    return res
      .status(200)
      .json({ message: "Item removed successfully", data: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};
