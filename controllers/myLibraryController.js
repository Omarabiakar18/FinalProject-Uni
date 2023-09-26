const Book = require("../models/bookModels").default;
const User = require("../models/userModels");

exports.AddMyLibrary = async (req, res) => {
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

    //3- Add to Library
    try {
      user.userLibrary.push(book._id);
      await user.save();

      return res
        .status(200)
        .json({ message: "Added to Library", data: user.userLibrary });
    } catch (error) {
      console.error(error);
      return res.status(404).json({ message: "Unable to add to Library" });
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

    // 2- Populate the MyLirary with book data
    const populatedUser = await User.findOne({
      email: req.body.email,
    }).populate("userLibrary");

    // 3- Extract the populated library with book info
    const populatedLibrary = populatedUser.userLibrary.map((item) => item);

    return res.status(200).json({
      message: "Successfully Retrieved Your Library",
      data: populatedLibrary,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};
