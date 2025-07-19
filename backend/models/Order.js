const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    cityStateZip: { type: String, required: true },
    products: [
      {
        name: String,
        variant: String,
        quantity: Number,
        price: Number,
        selectedSize: String,
        selectedColor: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    transactionStatus: {
      type: String,
      enum: ["Approved", "Declined", "Gateway Error"],
      required: true,
    },
  },
  { timestamps: true }
);

// Defensive model export to avoid OverwriteModelError
module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
