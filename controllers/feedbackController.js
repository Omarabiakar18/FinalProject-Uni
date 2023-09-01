const User = require("../models/userModels");
const sendMail = require("../utils/sendMail");

exports.feedback = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "This user doesn't exist" });
    }

    const feedbackString = req.body.feedback;
    if (!feedbackString) {
      return res.status(404).json({ message: "Enter your feedback." });
    }

    //3- Send the token via email

    //3.1- Ceate this URL

    const userFeedback = user.userFeedback;

    const feedback = `${userFeedback}`;
    const email = `${user.email}`;
    const msg = `Feedback from: ${email} is "${feedback}"`;
    try {
      await sendMail({
        from: "abiakaromar18@outlook.com",
        to: "abiakaromar18@outlook.com",
        subject: "Feedback from website!!",
        text: msg,
      });

      res
        .status(200)
        .json({
          message:
            "The email you sent is successful. Your feedback is recorded, Thank you for making this website better!!",
          data: true,
        });
    } catch (err) {
      console.log(err);
      await user.save({ validateBeforeSave: false });

      res.status(500).json({
        message:
          "An error occured while sending the email, please try again in a moment.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error" });
  }
};
