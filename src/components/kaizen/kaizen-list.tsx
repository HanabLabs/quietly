'use client'

import { format } from 'date-fns'

interface Kaizen {
    id: string
    content: string
    date: string
    created_at: string
}

interface KaizenListProps {
    kaizens: Kaizen[]
}

export default function KaizenList({ kaizens }: KaizenListProps) {
    if (kaizens.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-muted text-sm">No entries yet.</p>
                <p className="text-muted text-sm mt-1">Start by writing today's Kaizen.</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {kaizens.map((kaizen) => (
                <div key={kaizen.id} className="animate-quiet-fade">
                    <div className="text-xs text-muted mb-2">
                        {format(new Date(kaizen.date), 'MMMM d, yyyy')}
                    </div>
                    <p className="text-foreground leading-relaxed">{kaizen.content}</p>
                </div>
            ))}
        </div>
    )
}
