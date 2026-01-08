'use server'

import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'

export async function createSetupIntent() {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { success: false, error: 'Not authenticated' }
    }

    if (!stripe) {
        return { success: false, error: 'Payment service not configured' }
    }

    try {
        // Create or get customer
        const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', user.id)
            .single()

        const email = profile?.email || user.email

        // Search for existing customer
        const customers = await stripe.customers.list({
            email: email,
            limit: 1,
        })

        let customerId: string

        if (customers.data.length > 0) {
            customerId = customers.data[0].id
        } else {
            // Create new customer
            const customer = await stripe.customers.create({
                email: email,
                metadata: {
                    user_id: user.id,
                },
            })
            customerId = customer.id
        }

        // Create setup intent for collecting payment method
        const setupIntent = await stripe.setupIntents.create({
            customer: customerId,
            payment_method_types: ['card'],
            metadata: {
                user_id: user.id,
            },
        })

        return {
            success: true,
            clientSecret: setupIntent.client_secret,
            customerId: customerId,
        }
    } catch (error) {
        console.error('Error creating setup intent:', error)
        return { success: false, error: 'Failed to create setup intent' }
    }
}

export async function createSubscription(paymentMethodId: string, customerId: string) {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { success: false, error: 'Not authenticated' }
    }

    if (!stripe) {
        return { success: false, error: 'Payment service not configured' }
    }

    try {
        // Attach payment method to customer
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        })

        // Set as default payment method
        await stripe.customers.update(customerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        })

        // Create subscription
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
                price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
            }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
            metadata: {
                user_id: user.id,
            },
        })

        // Update user profile
        await supabase
            .from('profiles')
            .update({
                subscription_status: 'quiet_plus',
                subscription_id: subscription.id,
            })
            .eq('id', user.id)

        return {
            success: true,
            subscriptionId: subscription.id,
        }
    } catch (error) {
        console.error('Error creating subscription:', error)
        return { success: false, error: 'Failed to create subscription' }
    }
}
