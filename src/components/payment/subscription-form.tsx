'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { createSubscription } from '@/lib/stripe/subscription'
import { useRouter } from 'next/navigation'

interface SubscriptionFormProps {
    customerId: string
}

export default function SubscriptionForm({ customerId }: SubscriptionFormProps) {
    const stripe = useStripe()
    const elements = useElements()
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setLoading(true)
        setError(null)

        // Confirm the setup
        const { error: submitError, setupIntent } = await stripe.confirmSetup({
            elements,
            redirect: 'if_required',
        })

        if (submitError) {
            setError(submitError.message || 'Payment failed')
            setLoading(false)
            return
        }

        if (setupIntent && setupIntent.payment_method) {
            // Create subscription with the payment method
            const result = await createSubscription(
                setupIntent.payment_method as string,
                customerId
            )

            if (result.success) {
                router.push('/?success=true')
            } else {
                setError(result.error || 'Failed to create subscription')
                setLoading(false)
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-background border border-border rounded-lg p-6">
                <PaymentElement />
            </div>

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full py-3 px-6 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
            >
                {loading ? 'Processing...' : 'Keep my Kaizen'}
            </button>

            <p className="text-xs text-center text-muted">
                Your payment information is securely processed by Stripe.
            </p>
        </form>
    )
}
