const mongoose = require("mongoose");
const Book = require("../models/bookModels").default;
const User = require("../models/userModels");

exports.getNewReleases = async (req, res) => {
  try {
    // 1- Retrieve new releases from the database
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 30);

    // Query for books released after the threshold date
    const newReleases = await Book.find({
      releaseDate: { $gte: thresholdDate },
    });

    // 2- Send data to display
    if (newReleases.length === 0) {
      return res.status(400).json({ message: "No new releases." });
    } else {
      return res
        .status(200)
        .json({ message: "New releases retrieved", data: newReleases });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
};
