const express = require("express");
const { createCheckoutSession } = require("../controllers/paymentController");
const {
  handleStripeWebhook,
} = require("../controllers/paymentWebhookController");

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);
router.post("/create-checkout-session", createCheckoutSession);

module.exports = router;
