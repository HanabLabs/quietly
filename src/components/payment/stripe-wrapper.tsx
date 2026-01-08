'use client'

import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { createSetupIntent } from '@/lib/stripe/subscription'
import SubscriptionForm from '@/components/payment/subscription-form'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function StripeElementsWrapper() {
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [customerId, setCustomerId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function initialize() {
            const result = await createSetupIntent()

            if (result.success && result.clientSecret) {
                setClientSecret(result.clientSecret)
                setCustomerId(result.customerId!)
            } else {
                setError(result.error || 'Failed to initialize payment')
            }

            setLoading(false)
        }

        initialize()
    }, [])

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-muted">読み込み中...</p>
            </div>
        )
    }

    if (error || !clientSecret || !customerId) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">{error || '決済フォームの読み込みに失敗しました'}</p>
            </div>
        )
    }

    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret,
                appearance: {
                    theme: 'flat',
                    variables: {
                        colorPrimary: '#2d2926',
                        colorBackground: '#f5f3f0',
                        colorText: '#2d2926',
                        colorDanger: '#c73e3a',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif',
                        borderRadius: '4px',
                        spacingUnit: '4px',
                    },
                    rules: {
                        '.Input': {
                            border: '1px solid #d4cec4',
                            boxShadow: 'none',
                        },
                        '.Input:focus': {
                            border: '1px solid #6b7362',
                            boxShadow: 'none',
                        },
                    },
                },
            }}
        >
            <SubscriptionForm customerId={customerId} />
        </Elements>
    )
}
