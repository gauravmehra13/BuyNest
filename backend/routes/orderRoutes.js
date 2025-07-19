const express = require("express");
const { getOrderByOrderNumber } = require("../controllers/orderController");

const router = express.Router();

router.get("/:orderNumber", getOrderByOrderNumber);

module.exports = router;
