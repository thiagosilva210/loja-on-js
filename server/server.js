require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());

app.use(express.static("public"));

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

//products that we sell on our store

const storeItems = new Map([
  ["1", { priceInCents: 50999, name: "queen panel bed" }],
  ["2", { priceInCents: 60999, name: "king panel bed" }],
  ["3", { priceInCents: 40999, name: "single panel bed" }],
  ["4", { priceInCents: 30999, name: "twin panel bed" }],
  ["5", { priceInCents: 50999, name: "fridge" }],
  ["6", { priceInCents: 10999, name: "dresser" }],
  ["7", { priceInCents: 28999, name: "couch" }],
  ["8", { priceInCents: 20999, name: "table" }],
  ["9", { priceInCents: 22999, name: "queen square bed" }],
]);

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      shipping_rates: ["shr_1Je3onCkuNSV8dinDYAAE9LF"],
      shipping_address_collection: {
        allowed_countries: ["BR"],
      },

      line_items: req.body.items.map((item) => {
        const storeItem = storeItems.get(item.id);

        return {
          price_data: {
            currency: "brl",
            product_data: {
              name: storeItem.name,
            },

            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      success_url: `${process.env.SERVER_URL}/success.html`,
      cancel_url: `${process.env.SERVER_URL}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000);
