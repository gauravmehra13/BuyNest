const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, selectedSize, selectedColor } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if product already exists in user's cart (with same size/color)
    let existingItem = await Cart.findOne({
      user: req.user._id,
      "product._id": product._id,
      selectedSize,
      selectedColor,
    });

    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await existingItem.save();
      return res.status(200).json(existingItem);
    }

    const cartItem = new Cart({
      user: req.user._id,
      product: {
        _id: product._id,
        name: product.name,
        images: product.images,
        price: product.price,
      },
      quantity: quantity || 1,
      selectedSize,
      selectedColor,
    });

    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Cart.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found in your cart" });
    }

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

    // If quantity is less than 1, remove the item
    if (quantity !== undefined && quantity < 1) {
      await Cart.findOneAndDelete({ _id: id, user: req.user._id });
      return res.status(200).json({ message: "Item removed from cart" });
    }

    const updatedItem = await Cart.findOneAndUpdate(
      { _id: id, user: req.user._id },
      {
        ...(quantity !== undefined && { quantity }),
        ...(selectedSize !== undefined && { selectedSize }),
        ...(selectedColor !== undefined && { selectedColor }),
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found in your cart" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all cart items for the logged-in user
exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.user._id });
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear user's cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ user: req.user._id });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
