const mongoose = require("mongoose");
const Book = require("../models/bookModels").default;
const User = require("../models/userModels");

exports.popularNow = async (req, res) => {
  try {
    const soldCount = await Book.find({
      amountSold: { $gt: 40 },
    });

    if (soldCount > 40) {
      return res.status(400).json({ message: "No popular books available." });
    } else {
      return res
        .status(200)
        .json({ message: "Most Popular Retrived!!", data: soldCount });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "A server error has occurred", error });
  }
};
