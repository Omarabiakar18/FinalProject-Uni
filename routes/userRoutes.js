const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const addBookController = require("../controllers/addBookController");
const searchController = require("../controllers/searchController");

router.post("/userFeedback", feedbackController.feedback);
router.post("/addBook", addBookController.addBook);
router.post("/searchBook", searchController.search);

module.exports = router;
