const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

function generateTransactionId() {
  return uuidv4();
}

function convertToUSD(price) {
  return price * 100;
}

module.exports = {
  createCheckoutSession: async (req, res) => {
    const { name, email, type, items } = req.body;
    const transactionId = generateTransactionId();

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [
            "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTK_Qsmy_ahLnSY2XSCu5qdlVdrwSXqbXJx90XP42YXGIkeSnrj",
          ],
        },
        unit_amount: convertToUSD(item.price),
      },
      quantity: 1,
    }));

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.BASE_URL}?success=true&transaction_id=${transactionId}`,
        cancel_url: `${process.env.BASE_URL}?success=false&transaction_id=${transactionId}`,
        client_reference_id: transactionId,
        metadata: {
          name: name,
          email: email,
          type: type,
        },
      });

      res.json({ redirectUrl: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).send({ error: "Failed to create checkout session" });
    }
  },
};
