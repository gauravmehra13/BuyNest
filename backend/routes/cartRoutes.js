const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

router.post("/add", protect, cartController.addToCart);
router.delete("/remove/:id", protect, cartController.removeFromCart);
router.put("/update/:id", protect, cartController.updateCartItem);
router.get("/", protect, cartController.getCartItems);
router.post("/clear", protect, cartController.clearCart);

module.exports = router;
