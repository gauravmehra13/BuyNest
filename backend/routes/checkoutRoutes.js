const express = require("express");
const { processCheckout } = require("../controllers/checkoutController");

const router = express.Router();

router.post("/", processCheckout);

module.exports = router;
