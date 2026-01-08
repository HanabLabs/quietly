'use client'

import { useState, useEffect } from 'react'
import { createKaizen } from '@/lib/kaizen/actions'

interface KaizenFormProps {
    initialValue?: string
    onSaved?: () => void
}

export default function KaizenForm({ initialValue = '', onSaved }: KaizenFormProps) {
    const [content, setContent] = useState(initialValue)
    const [isSaving, setIsSaving] = useState(false)
    // If there's an initial value, it means today's kaizen is already saved
    const [isSaved, setIsSaved] = useState(!!initialValue)
    const [showAnimation, setShowAnimation] = useState(false)

    useEffect(() => {
        // Update content and saved state when initialValue changes
        setContent(initialValue)
        setIsSaved(!!initialValue)
    }, [initialValue])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() || isSaving || isSaved) return

        setIsSaving(true)
        const result = await createKaizen(content)

        if (result.success) {
            setShowAnimation(true)
            setContent('')

            setTimeout(() => {
                setShowAnimation(false)
                setIsSaved(true)
                setIsSaving(false)
                onSaved?.()
            }, 600)
        } else {
            setIsSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mb-12">
            <div className="mb-3">
                <label htmlFor="kaizen" className="block text-sm text-muted mb-2">
                    Today's Kaizen
                </label>
                <textarea
                    id="kaizen"
                    value={content}
                    onChange={(e) => {
                        if (e.target.value.length <= 140 && !isSaved) {
                            setContent(e.target.value)
                        }
                    }}
                    placeholder="A small improvement you made today..."
                    rows={3}
                    maxLength={140}
                    disabled={isSaved}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-accent transition-colors text-foreground resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted">
                        {content.length} / 140
                    </span>
                    {isSaved && (
                        <span className="text-xs text-muted">
                            Saved for today
                        </span>
                    )}
                </div>
            </div>

            <div className={showAnimation ? 'animate-quiet-sink' : ''}>
                {isSaved ? (
                    <div className="px-6 py-2 text-sm text-muted">
                        You've recorded today's Kaizen
                    </div>
                ) : (
                    <button
                        type="submit"
                        disabled={isSaving || !content.trim()}
                        className="px-6 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm font-medium"
                    >
                        {isSaving ? 'Saving...' : 'Save quietly'}
                    </button>
                )}
            </div>
        </form>
    )
}
