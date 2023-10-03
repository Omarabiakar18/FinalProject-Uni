const Book = require("../models/bookModels").default;
const User = require("../models/userModels");
const Library = require("../models/libraryModel");
const Item = require("../models/cartModels");

exports.AddMyLibrary = async (req, res) => {
  try {
    // 1- Make sure the user is valid
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "This user doesn't exist" });
    }

    // 2- Get all items from userCart
    const userCartItems = user.userCart;
    if (userCartItems.length === 0) {
      return res
        .status(200)
        .json({ message: "No items in the cart to transfer" });
    }

    try {
      const userLibrary = user.userLibrary;
      const libraryDocuments = [];

      for (const itemId of userCartItems) {
        const item = await Item.findById(itemId);

        if (!item) {
          return res
            .status(404)
            .json({ message: "One or more items do not exist" });
        }

        libraryDocuments.push({
          bookInfo: item.bookInfo,
          bookQuantity: item.bookQuantity,
          formatBook: item.formatBook,
        });
      }
      const insertedLibraryDocuments = await Library.insertMany(
        libraryDocuments
      );

      userLibrary.push(...insertedLibraryDocuments.map((doc) => doc._id));
      await user.save();

      return res
        .status(200)
        .json({ message: "Items moved to Library", data: userLibrary });
    } catch (error) {
      console.error(error);
      return res
        .status(404)
        .json({ message: "Unable to move items to Library" });
    }
  } catch (error) {
    console.error(error);
  }
};

exports.MyLibraryDisplay = async (req, res) => {
  try {
    // 1- Make sure the user is valid
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "This user doesn't exist" });
    }

    // 2- Populate the MyLibrary with book data
    const populatedUser = await User.findOne({
      email: req.body.email,
    }).populate({
      path: "userLibrary",
      model: "Library",
      populate: {
        path: "bookInfo",
        model: "Book",
      },
    });

    // 3- Extract the populated library with book info
    const populatedLibrary = populatedUser.userLibrary;

    return res.status(200).json({
      message: "Successfully Retrieved Your Library",
      data: populatedLibrary,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};
