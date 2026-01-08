'use client'

import { useEffect, useState } from 'react'
import { markWeeklyReflectionShown } from '@/lib/reflection/check-weekly'

interface WeeklyReflectionProps {
    message: string
}

export default function WeeklyReflection({ message }: WeeklyReflectionProps) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        // Mark as shown when component mounts
        markWeeklyReflectionShown()
    }, [])

    if (!isVisible) return null

    return (
        <div className="mb-12 animate-quiet-fade">
            <div className="bg-background border border-border rounded-lg p-6 max-w-md mx-auto">
                <p className="text-foreground text-center whitespace-pre-line leading-relaxed">
                    {message}
                </p>
                <button
                    onClick={() => setIsVisible(false)}
                    className="mt-4 text-xs text-muted hover:text-foreground transition-colors w-full text-center"
                >
                    Close
                </button>
            </div>
        </div>
    )
}
