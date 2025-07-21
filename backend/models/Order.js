const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
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
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    transactionStatus: {
      type: String,
      enum: ["Approved", "Declined", "Gateway Error"],
      required: true,
    },
  },
  { timestamps: true }
);

// Add index for faster user queries
orderSchema.index({ user: 1, createdAt: -1 });

// Defensive model export to avoid OverwriteModelError
module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
