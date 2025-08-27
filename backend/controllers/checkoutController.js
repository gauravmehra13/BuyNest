const stripe = require("../config/stripe"); // Import Stripe
const Order = require("../models/Order");
const Product = require("../models/Product");
const sendOrderEmail = require("../config/sendgrid");
const { v4: uuidv4 } = require("uuid");

exports.processCheckout = async (req, res) => {
  try {
    const {
      user,
      customerName,
      email,
      phoneNumber,
      address,
      cityStateZip,
      products,
      totalAmount,
      paymentMethodId, // Payment method ID from the frontend
    } = req.body;

    // Create a Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "inr",
      payment_method: paymentMethodId,
      confirm: true,
      description: `Order for ${customerName} (${email})`,
      metadata: {
        orderNumber: uuidv4(),
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    // Handle payment status
    let transactionStatus;
    switch (paymentIntent.status) {
      case "succeeded":
        transactionStatus = "Approved";
        break;
      case "requires_action":
      case "requires_payment_method":
        transactionStatus = "Declined";
        break;
      default:
        transactionStatus = "Gateway Error";
    }

    const orderNumber = uuidv4();

    const newOrder = new Order({
      orderNumber,
      user,
      customerName,
      email,
      phoneNumber,
      address,
      cityStateZip,
      products,
      totalAmount,
      transactionStatus,
    });

    await newOrder.save();

    if (transactionStatus === "Approved") {
      for (const item of products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { inventoryCount: -item.quantity },
        });
      }
    }

    await sendOrderEmail(newOrder, transactionStatus);

    res.json({
      message: `Transaction ${transactionStatus}`,
      orderNumber: newOrder.orderNumber,
      paymentIntentId: paymentIntent.id, // Return the Payment Intent ID for reference
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Checkout failed", error });
  }
};
