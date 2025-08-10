const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, default: 1 },
    selectedSize: { type: String },
    selectedColor: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
