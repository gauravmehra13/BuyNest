const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      images: { type: [String], required: true },
      price: { type: Number, required: true },
    },
    quantity: { type: Number, required: true, default: 1 },
    selectedSize: { type: String },
    selectedColor: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
