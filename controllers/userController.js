const validator = require("validator");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");

// To create a jwt token we should split the process into 2 parts
// 1: Create a function taht will sign a token
// To sign a token, we should provide 3 main factors:
// Factor 1: A unique field from the user: we choose always the id Factor
//2: JWT_SECRECT
//Factor3: JWT_EXPIRES_IN

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// 2- Create a function that will send the token to the user
const createSendToken = (user, statusCode, res, msg) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: "Success",
    token,
    data: { message: msg, user },
  });
};

exports.signUp = async (req, res) => {
  try {
    // 1- Check if the email is valid
    let email = req.body.email;
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "This email is invalid!!" });
    }

    // 2- Check if the email is already in use

    const checkEmail = await User.findOne({ email: req.body.email });
    if (checkEmail) {
      return res.status(409).json({ message: "This email is already in use." });
    }
    // 3- Check if the password and the confirmpassword are the same
    const password = req.body.password;
    const confirmpassword = req.body.passwordConfirm;

    // But passwords are hashed my bcrypt so we compare the hashed passwords
    // This is automated in the user Model
    // console.log(password);
    // console.log(confirmpassword);

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passowrd don't match." });
    }

    //4- If everything in ok ---> Create a new user

    const newUser = await User.create({
      fullName: req.body.fullName,
      email: req.body,
      email,
      password: req.body.password,
    });

    let msg = "User created successfully.";
    createSendToken(newUser, 201, res, msg);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.logIn = async (req, res) => {
  try {
    // 1: Check if the user email exists in the DB

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "This email doesn't exist!! SignUp to Continue!!" });
    }

    //2: Check if the enterd password is matching with the hashed stored password

    if (!(await user.checkPassword(req.body.password, user.password))) {
      return res
        .status(401)
        .json({ message: "Your email or password is incorrect." });
    }

    //3: If everything is ok, Log the user in

    let msg = "Login Successfull.";
    createSendToken(user, 200, res, msg);
  } catch (error) {
    console.log(error);
  }
};

exports.forgotPassword = async (req, res) => {
  //1- Check if the user proided an existing email
  //If we want to reset via email and phone:
  //const user = await User.findOne({$or:[{email: req.body.email},{phoneNumber: req.body.phoneNumber}]})

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(401).json({ message: "Please enter a valid email." });
  }

  //2- Check the reset token to be sent via email

  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3- Send the token via email
  // http://127.0.0.1:3000/api/auth/resetPassword/jsrt1js8rh5s19sn1gnfn651f85m41f5j5rj95jtjgm

  //3.1- Ceate this URL
  const url = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/resetPassword/${resetToken}`;

  const msg = `Forget your password? Reset it by visiting the following link: ${url}`;
  try {
    await sendMail({
      from: "abiakaromar18@outlook.com",
      to: user.email,
      subject: "Your Password reset token: (Valid for 10 min)",
      text: msg,
    });

    res
      .status(200)
      .json({
        status: "success",
        message: "The email you sent is successful.",
      });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      message:
        "An error occured while sending the email, please try again in a moment.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({
          message: "The token is invalid, or expired. Please request a new one",
        });
    }
    if (req.body.password.length < 8) {
      return res.status(400).json({ message: "Password length is too short" });
    }
    if (req.body.password !== req.body.passwordConfirm) {
      return res
        .status(400)
        .json({ message: "Password & Password Confirm are not the same" });
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.log(err);
  }
};
exports.protect = async (req, res, next) => {
  try {
    // 1: Check if the token still exists
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res
        .status(401)
        .json({
          message: "You are not logged in. Please login to get access.",
        });
    }

    // 2: Verify the token
    let decoded;
    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRECT);
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token, Login again" });
      } else if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Your session token has expried !! " });
      }
    }
    // 3: Check if the token owner still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json("The user in this session no longer exists");
    }
    // 4: Check if the owner changed the password after token was created
    // iat: Time where the token was issued
    // exp: the time where the token will be expired

    if (currentUser.passwordChangedAfterTokenIssued(decoded.iat)) {
      res
        .status(401)
        .json("Your password has been changed!! Please log in again");
    }

    // 5: If everything is ok: ADD the user to all the requests (req.user = currentUser)
    req.user = currentUser;
    next();
  } catch (error) {
    console.log(error);
  }
};
