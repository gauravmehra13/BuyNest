const mongoose = require("mongoose");
const Favorite = require("../models/Favorite");

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.find({ userId }).populate("productId"); // Will return full product object

    // Optional: Rename "productId" to "product" in response for frontend consistency
    const formatted = favorites.map((fav) => ({
      ...fav.toObject(),
      product: fav.productId,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToFavorites = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const favorite = await Favorite.findOneAndUpdate(
      { userId, productId },
      { userId, productId },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Added to favorites", favorite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    await Favorite.deleteOne({ userId, productId });

    res.status(200).json({ message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
