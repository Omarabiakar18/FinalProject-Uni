const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const addBookController = require("../controllers/addBookController");
const searchController = require("../controllers/searchController");
const addToCart = require("../controllers/cart/addToCart");
const itemsInCart = require("../controllers/cart/itemsInCart");
const removeFromCart = require("../controllers/cart/removeFromCart");
const updateQuantity = require("../controllers/cart/updateQuantity");
const newRelease = require("../controllers/newReleaseController");
const reviewBook = require("../controllers/reviewBookController");

router.post("/userFeedback", feedbackController.feedback);
router.post("/addBook", addBookController.addBook);
router.post("/searchBook", searchController.search);
router.post("/addToCart", addToCart.addToCart);
router.post("/itemsInCart", itemsInCart.displayItemsInCart);
router.post("/removeFromCart", removeFromCart.removeFromCart);
router.post("/updateQuantity", updateQuantity.updateQuantity);
router.get("/newRelease", newRelease.getNewReleases);
router.post("/reviewBook", reviewBook.reviewBook);

module.exports = router;
