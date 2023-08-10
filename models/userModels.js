const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please enter your Full Name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your Email"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      minLength: 8,
      //maxLength: 30,
      required: [true, "Please enter your Password"],
    },
    userFeedback: {
      type: String,
      default: " ",
    },
    userLibrary: [
      {
        type: ObjectId,
        ref: "Book",
      },
    ],
    booksUploaded: {
      type: Number,
      default: 0,
    },
    accountType: {
      type: String,
    },
    userCart: [
      {
        type: ObjectId,
        ref: "Item",
      },
    ],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
  } catch (error) {
    console.log(error);
  }
});

userSchema.methods.checkPassword = async function (
  enteredpassword,
  DBpassword
) {
  return await bcrypt.compare(enteredpassword, DBpassword); // Will return TRUE OR FALSE
};

//This function will create a random reset token
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex"); //Will be sent via email

  //Saved in the DB in a hashed way
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Valid for 10 mins
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

//This function will check if the password was changed after token creation
userSchema.methods.passwordChangedAfterTokenIssued = function (JWTtimestamp) {
  if (this.passwordChangedAt) {
    const passwordChangeTime = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    ); //Base 10
    return passwordChangeTime > JWTtimestamp;
  }
  return false;
};

module.exports = mongoose.model("User", userSchema);
