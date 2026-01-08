'use client'

import { useEffect, useState } from 'react'
import { markPricingNotificationShown } from '@/lib/pricing/check-notification'
import Link from 'next/link'

export default function QuietPricingNotification() {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        // Mark as shown when component mounts
        markPricingNotificationShown()
    }, [])

    if (!isVisible) return null

    return (
        <div className="mb-12 animate-quiet-fade">
            <div className="bg-background border border-border rounded-lg p-6 max-w-md mx-auto">
                <p className="text-muted text-sm leading-relaxed mb-4">
                    You've been writing quietly for a while.
                </p>
                <p className="text-muted text-sm leading-relaxed mb-4">
                    If you'd like to keep your older Kaizen entries, Quiet Plus is available.
                </p>
                <div className="flex flex-col gap-2">
                    <Link
                        href="/pricing"
                        className="text-sm text-foreground hover:underline text-center"
                    >
                        Learn more
                    </Link>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-xs text-muted hover:text-foreground transition-colors"
                    >
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    )
}
