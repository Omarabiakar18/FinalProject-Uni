const express = require('express');
const router = express.Router();
const userController = require("../controllers/userController");


router.post("/signup", userController.signUp);
router.post("/login", userController.logIn);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword/:token", userController.resetPassword);

module.exports = router;