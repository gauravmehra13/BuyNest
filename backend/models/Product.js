const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    images: [{ type: String, required: true }],
    sizes: [{ type: String, required: true }],
    colors: [{ type: String, required: true }],
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    inventoryCount: { type: Number, required: true },
  },
  { timestamps: true }
);

// Defensive model export to avoid OverwriteModelError
module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
