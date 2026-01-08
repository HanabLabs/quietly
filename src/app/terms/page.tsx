import Link from 'next/link'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-6 py-12">
                <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
                    ← Back
                </Link>

                <h1 className="text-2xl font-medium text-foreground mt-8 mb-8">Terms of Service</h1>

                <div className="prose prose-sm max-w-none space-y-6 text-muted">
                    <section>
                        <h2 className="text-lg font-medium text-foreground mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Quietly, you accept and agree to be bound by the terms and
                            provisions of this agreement.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-medium text-foreground mb-3">2. Use of Service</h2>
                        <p>
                            Quietly is a personal improvement tracking service. You agree to use the service
                            for lawful purposes only and in accordance with these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-medium text-foreground mb-3">3. User Content</h2>
                        <p>
                            You retain all rights to the content you create and store in Quietly. We do not
                            claim ownership of your Kaizen entries.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-medium text-foreground mb-3">4. Subscription and Billing</h2>
                        <p>
                            Quietly Plus is a subscription service billed monthly. You may cancel your
                            subscription at any time. Upon cancellation, you will retain access until the
                            end of your current billing period.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-medium text-foreground mb-3">5. Data Retention</h2>
                        <p>
                            Free users have access to the last 14 days of Kaizen entries. Quietly Plus
                            subscribers have access to their complete history. Your data remains yours
                            even after cancellation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-medium text-foreground mb-3">6. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. We will notify users
                            of any material changes via email.
                        </p>
                    </section>

                    <section className="pt-8">
                        <p className="text-sm">
                            Last updated: January 8, 2026
                        </p>
                        <p className="text-sm mt-2">
                            Questions? Contact us at{' '}
                            <a href="mailto:habab@hanablabs.info" className="text-foreground hover:underline">
                                habab@hanablabs.info
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
