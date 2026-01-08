import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
    if (!stripe) {
        return NextResponse.json({ error: 'Payment service not configured' }, { status: 500 })
    }

    const body = await req.text()
    const signature = (await headers()).get('stripe-signature')

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err) {
        console.error('Webhook signature verification failed:', err)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const supabase = await createClient()

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                const userId = session.metadata?.user_id

                if (!userId) {
                    console.error('No user_id in session metadata')
                    break
                }

                // Update user to paid subscription
                await supabase
                    .from('profiles')
                    .update({
                        subscription_status: 'quiet_plus',
                        subscription_id: session.subscription as string,
                    })
                    .eq('id', userId)

                break
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription

                // Find user by subscription_id and update to free
                await supabase
                    .from('profiles')
                    .update({
                        subscription_status: 'free',
                        subscription_id: null,
                    })
                    .eq('subscription_id', subscription.id)

                break
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription

                // Update subscription status based on Stripe status
                const status = subscription.status === 'active' ? 'quiet_plus' : 'free'

                await supabase
                    .from('profiles')
                    .update({
                        subscription_status: status,
                    })
                    .eq('subscription_id', subscription.id)

                break
            }
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Error processing webhook:', error)
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
    }
}
