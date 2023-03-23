//read https://stripe.com/docs/payments/quickstart choose frontend:HTML and backend:Node then in server.js 
const stripe = require("stripe")(process.env.STRIPE_KEY);  //according to the document we should add the stripe key after importing it

const stripeController = async (req, res) => {
  // console.log(req.body)  //  purchase: { id: '1', name: 't-shirt', price: 1999 },{ id: '2', name: 'shoes', price: 4999 }],total_amount: 10998,shipping_fee: 1099}

  const { purchase, total_amount, shipping_fee } = req.body;

  //normally we communicate with the backend using the DB
  //in this project our list is hard coded in public>browser-app.js, 
  const calculateOrderAmount = () => {
    return total_amount + shipping_fee;
  };
  //for stripe.payementIntent.create() read https://stripe.com/docs/payments/quickstart then server.js
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(),
    currency: "usd",
  });

  res.json({ clientSecret: paymentIntent.client_secret }); //clientSecret is the name we choose in browser-app.js
};

module.exports = stripeController;