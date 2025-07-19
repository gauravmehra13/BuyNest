const Order = require("../models/Order");
const Product = require("../models/Product");
const sendOrderEmail = require("../config/sendgrid");
const { v4: uuidv4 } = require("uuid");

exports.processCheckout = async (req, res) => {
  try {
    const {
      customerName,
      email,
      phoneNumber,
      address,
      cityStateZip,
      products,
      totalAmount,
      transactionType,
    } = req.body;

    let transactionStatus;
    switch (transactionType) {
      case "1":
        transactionStatus = "Approved";
        break;
      case "2":
        transactionStatus = "Declined";
        break;
      case "3":
        transactionStatus = "Gateway Error";
        break;
      default:
        transactionStatus = "Gateway Error";
    }

    const orderNumber = uuidv4();

    const newOrder = new Order({
      orderNumber,
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
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Checkout failed", error });
  }
};
