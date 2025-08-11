const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      images: { type: [String], required: true },
      price: { type: Number, required: true },
    }
  },
  { timestamps: true }
);

// Prevent duplicate favorites
favoriteSchema.index({ user: 1, "product._id": 1 }, { unique: true });

module.exports = mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);