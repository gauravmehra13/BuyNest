const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
const { protect } = require("../middleware/auth");

router.get("/", protect, favoriteController.getFavorites);
router.post("/add", protect, favoriteController.addToFavorites);
router.delete("/remove/:id", protect, favoriteController.removeFromFavorites);

module.exports = router;
