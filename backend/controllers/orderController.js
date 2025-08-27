const Order = require("../models/Order");

exports.getOrderByOrderNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({ orderNumber });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateOrderStatus = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) return;

    const now = new Date();
    const orderDate = order.createdAt;
    const timeDiff = now - orderDate;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    let newStatus = order.status;

    if (daysDiff >= 2) {
      newStatus = 'delivered';
    } else if (daysDiff >= 1) {
      newStatus = 'shipped';
    } else if (daysDiff >= 0.1) { // 0.1 days = 2.4 hours
      newStatus = 'processing';
    }

    if (newStatus !== order.status) {
      order.status = newStatus;
      await order.save();
    }
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};
