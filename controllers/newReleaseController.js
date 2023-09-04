const mongoose = require("mongoose");
const Book = require("../models/bookModels").default;
const User = require("../models/userModels");

exports.getNewReleases = async (req, res) => {
  try {
    const limit = 25;
    const recentBooks = await Book.find({})
      .sort({ releaseDate: -1 })
      .limit(limit);

    // 2- Send data to display
    if (recentBooks.length === 0) {
      return res.status(400).json({ message: "No recent releases." });
    } else {
      return res
        .status(200)
        .json({ message: "Recent books retrieved", data: recentBooks });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
};
