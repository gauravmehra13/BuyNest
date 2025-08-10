const Cart = require("../models/Cart");

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, selectedSize, selectedColor } = req.body;
    const cartItem = new Cart({
      productId,
      quantity,
      selectedSize,
      selectedColor,
    });
    await cartItem.save();
    const populatedItem = await Cart.findById(cartItem._id).populate(
      "productId"
    );
    res.status(201).json(populatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndDelete(id);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update cart item
exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, selectedSize, selectedColor } = req.body;
    const updateFields = {};
    if (quantity !== undefined) updateFields.quantity = quantity;
    if (selectedSize !== undefined) updateFields.selectedSize = selectedSize;
    if (selectedColor !== undefined) updateFields.selectedColor = selectedColor;

    const updatedItem = await Cart.findByIdAndUpdate(id, updateFields, {
      new: true,
    }).populate("productId");
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all cart items
exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.find().populate("productId");
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear Cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({});
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
