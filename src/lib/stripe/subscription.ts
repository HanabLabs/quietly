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
        const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', user.id)
            .single()

        const email = profile?.email || user.email

        const customers = await stripe.customers.list({
            email: email,
            limit: 1,
        })

        let customerId: string

        if (customers.data.length > 0) {
            customerId = customers.data[0].id
        } else {
            const customer = await stripe.customers.create({
                email: email,
                metadata: {
                    user_id: user.id,
                },
            })
            customerId = customer.id
        }

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
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        })

        await stripe.customers.update(customerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        })

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

export async function cancelSubscription() {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { success: false, error: 'Not authenticated' }
    }

    if (!stripe) {
        return { success: false, error: 'Payment service not configured' }
    }

    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_id')
            .eq('id', user.id)
            .single()

        if (!profile?.subscription_id) {
            return { success: false, error: 'No active subscription' }
        }

        await stripe.subscriptions.cancel(profile.subscription_id)

        await supabase
            .from('profiles')
            .update({
                subscription_status: 'free',
                subscription_id: null,
            })
            .eq('id', user.id)

        return { success: true }
    } catch (error) {
        console.error('Error canceling subscription:', error)
        return { success: false, error: 'Failed to cancel subscription' }
    }
}
