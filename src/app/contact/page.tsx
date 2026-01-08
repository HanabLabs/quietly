import Link from 'next/link'

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-6 py-12">
                <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
                    ← Back
                </Link>

                <h1 className="text-2xl font-medium text-foreground mt-8 mb-8">Contact</h1>

                <div className="space-y-6 text-muted">
                    <p>
                        If you have questions, feedback, or need support, please reach out.
                    </p>

                    <div>
                        <p className="text-sm text-muted mb-1">Email</p>
                        <a
                            href="mailto:habab@hanablabs.info"
                            className="text-foreground hover:underline"
                        >
                            habab@hanablabs.info
                        </a>
                    </div>

                    <p className="text-sm text-muted">
                        We typically respond within 24-48 hours.
                    </p>
                </div>
            </div>
        </div>
    )
}
