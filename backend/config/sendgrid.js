const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOrderEmail = async (order, transactionStatus) => {
  let subject, message;

  const products = Array.isArray(order.products) ? order.products : [];

  const productDetails = products
    .map((product) => {
      const name = product.name || "Unnamed Product";
      const quantity = Number(product.quantity) || 1;
      const price = Number(product.price) || 0;
      const selectedSize = product.selectedSize || "N/A";
      const selectedColor = product.selectedColor || "N/A";

      const itemSubtotal = price * quantity;
      const tax = itemSubtotal * 0.15;
      const totalWithTax = itemSubtotal + tax;

      return `
        <li>
          <strong>${name}</strong><br />
          Size: ${selectedSize}<br />
          Color: ${selectedColor}<br />
          Quantity: ${quantity}<br />
          Unit Price: ₹${price.toFixed(2)}<br />
          Subtotal: ₹${itemSubtotal.toFixed(2)}<br />
          Tax (15%): ₹${tax.toFixed(2)}<br />
          Total: ₹${totalWithTax.toFixed(2)}
        </li>
      `;
    })
    .join("");

  const totalAmount =
    typeof order.totalAmount === "number" ? order.totalAmount : 0;

  if (transactionStatus === "Approved") {
    subject = `✅ Order #${order.orderNumber || "N/A"} Confirmed`;
    message = `
      <h2>Thank you for your order, ${order.customerName || "Customer"}!</h2>
      <p><strong>Order Number:</strong> ${order.orderNumber || "N/A"}</p>
      <p><strong>Total Amount (incl. taxes):</strong> ₹${totalAmount.toFixed(
        2
      )}</p>

      <h3>Customer Details:</h3>
      <p>Email: ${order.email || "N/A"}</p>
      <p>Phone: ${order.phoneNumber || "N/A"}</p>
      <p>Shipping Address: ${order.address || "N/A"}, ${
      order.cityStateZip || "N/A"
    }</p>

      <h3>Ordered Products:</h3>
      <ul>${productDetails}</ul>

      <p>We will ship your items soon!</p>
    `;
  } else {
    subject = `❌ Order #${order.orderNumber || "N/A"} Failed`;
    message = `
      <h2>Transaction Failed</h2>
      <p>Reason: ${transactionStatus}</p>
      <p>Customer: ${order.customerName || "N/A"} (${order.email || "N/A"})</p>
      <p>Please try again or contact support.</p>
    `;
  }

  try {
    await sgMail.send({
      to: order.email,
      from: process.env.SENDGRID_FROM_EMAIL, // Use verified sender
      subject: subject,
      html: message,
    });
    console.log("Email sent via SendGrid.");
  } catch (error) {
    console.error("SendGrid Email Error:", error);
    throw error;
  }
};

module.exports = sendOrderEmail;
