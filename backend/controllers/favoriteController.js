const Favorite = require("../models/Favorite");
const Product = require("../models/Product");

// Add item to favorites
exports.addToFavorites = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if product already exists in user's favorites
    const existingItem = await Favorite.findOne({
      user: req.user._id,
      "product._id": product._id,
    });

    if (existingItem) {
      return res.status(400).json({ error: "Product already in favorites" });
    }

    const favoriteItem = new Favorite({
      user: req.user._id,
      product: {
        _id: product._id,
        name: product.name,
        images: product.images,
        price: product.price,
      },
    });

    await favoriteItem.save();
    res.status(201).json(favoriteItem);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Product already in favorites" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Remove item from favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Favorite.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deletedItem) {
      return res
        .status(404)
        .json({ error: "Item not found in your favorites" });
    }

    res.status(200).json({ message: "Item removed from favorites" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all favorite items for the logged-in user
exports.getFavoriteItems = async (req, res) => {
  try {
    const favoriteItems = await Favorite.find({ user: req.user._id });
    res.status(200).json(favoriteItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear user's favorites
exports.clearFavorites = async (req, res) => {
  try {
    await Favorite.deleteMany({ user: req.user._id });
    res.status(200).json({ message: "Favorites cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if a product is in favorites (additional useful endpoint)
exports.checkFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const favoriteItem = await Favorite.findOne({
      user: req.user._id,
      "product._id": productId,
    });

    res.status(200).json({ isFavorite: !!favoriteItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
