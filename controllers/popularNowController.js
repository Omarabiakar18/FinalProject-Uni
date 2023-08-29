//Doesn't work

const mongoose = require("mongoose");
const Book = require("../models/bookModels").default;
const User = require("../models/userModels");

exports.popularNow = async (req, res) => {
  try {
    // 1- Make sure the user is valid
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "This user doesn't exist" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred", error });
  }
};
