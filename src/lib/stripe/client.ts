import Stripe from 'stripe'

const secretKey = process.env.STRIPE_SECRET_KEY

export const stripe = secretKey
    ? new Stripe(secretKey, {
        apiVersion: '2025-02-24.acacia',
        typescript: true,
    })
    : null

