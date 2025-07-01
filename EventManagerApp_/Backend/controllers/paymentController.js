import Payment from '../models/paymentModel.js';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  const { amount, currency = 'eur' } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // en centimes
      currency,
      // Tu peux ajouter des metadata ici (ex: userId, eventId)
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Après confirmation du paiement Stripe (dans un webhook ou après confirmation côté client)
export const savePayment = async (req, res) => {
  const { userId, eventId, amount, stripePaymentIntentId} = req.body;
  try {
    const payment = await Payment.create({
      userId,
      eventId,
      amount,
      stripePaymentIntentId,
    });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};