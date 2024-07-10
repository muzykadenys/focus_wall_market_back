const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { sendEmail } = require("./emailController");

module.exports = {
  handleStripeWebhook: async (req, res) => {
    let event;

    try {
      const stripeSignature = req.headers["stripe-signature"];
      const rawBody = req.body;

      event = stripe.webhooks.constructEvent(
        rawBody,
        stripeSignature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Error verifying webhook signature:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      let lineItems;
      try {
        lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        console.log("Line Items:", lineItems);
      } catch (error) {
        console.error("Error fetching line items:", error);
      }

      const { metadata } = session;
      try {
        await sendEmail({
          name: metadata.name,
          email: metadata.email,
          type: metadata.type,
          items: lineItems.data,
        });
      } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).send({ error: "Failed to send email" });
      }
    }

    res.json({ received: true });
  },
};
