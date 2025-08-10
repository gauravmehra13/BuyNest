const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Add item to cart
router.post("/add", cartController.addToCart);

// Remove item from cart
router.delete("/remove/:id", cartController.removeFromCart);

// Update cart item
router.put("/update/:id", cartController.updateCartItem);

// Get all cart items
router.get("/", cartController.getCartItems);

// Clear cart
router.post("/clear", cartController.clearCart);

module.exports = router;
