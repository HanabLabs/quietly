'use client'

import { useState } from 'react'
import { cancelSubscription } from '@/lib/stripe/subscription'
import { useRouter } from 'next/navigation'

export default function CancelSubscriptionButton() {
    const router = useRouter()
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleCancel = async () => {
        setLoading(true)
        setError('')

        const result = await cancelSubscription()

        if (result.success) {
            router.refresh()
        } else {
            setError(result.error || 'Failed to cancel subscription')
            setLoading(false)
        }
    }

    if (showConfirm) {
        return (
            <div className="space-y-4">
                <div className="bg-background border border-border rounded-lg p-4">
                    <p className="text-sm text-foreground mb-4">
                        Are you sure you want to cancel your subscription?
                    </p>
                    <p className="text-xs text-muted mb-4">
                        Your subscription will remain active until the end of your billing period.
                        After that, you'll lose access to your full Kaizen history.
                    </p>
                    {error && (
                        <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>
                    )}
                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
                        >
                            {loading ? 'Canceling...' : 'Yes, cancel'}
                        </button>
                        <button
                            onClick={() => setShowConfirm(false)}
                            disabled={loading}
                            className="px-4 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-muted/10 transition-colors disabled:opacity-50 text-sm"
                        >
                            Keep subscription
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <button
            onClick={() => setShowConfirm(true)}
            className="text-sm text-muted hover:text-foreground transition-colors"
        >
            Cancel subscription
        </button>
    )
}
