const cron = require('node-cron');
const Order = require('../models/Order');
const { updateOrderStatus } = require('../controllers/orderController');

// Schedule the task to run every hour
cron.schedule('0 * * * *', async () => {
  try {
    const orders = await Order.find({ status: { $in: ['pending', 'processing', 'shipped'] } });
    for (const order of orders) {
      await updateOrderStatus(order._id);
    }
  } catch (error) {
    console.error('Error in scheduled task:', error);
  }
});
