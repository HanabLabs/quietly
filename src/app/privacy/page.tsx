import Link from 'next/link'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-6 py-12">
                <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
                    ← Back
                </Link>

                <h1 className="text-2xl font-medium text-foreground mt-8 mb-8">Privacy Policy</h1>

                <div className="prose prose-sm max-w-none space-y-6 text-muted">
                    <section>
                        <h2 className="text-lg font-medium text-foreground mb-3">1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, including your email address
                            and the content of your Kaizen entries.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-medium text-foreground mb-3">2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Provide, maintain, and improve Quietly</li>
                            <li>Send you technical notices and support messages</li>
                            <li>Respond to your comments and questions</li>
                            <li>Process transactions and send related information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-medium text-foreground mb-3">3. Data Storage</h2>
                        <p>
                            Your data is stored securely using Supabase, a trusted database provider.
                            We implement appropriate security measures to protect your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-medium text-foreground mb-3">4. Third-Party Services</h2>
                        <p>
                            We use the following third-party services:
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Supabase for authentication and data storage</li>
                            <li>Stripe for payment processing</li>
                            <li>Resend for sending transactional emails</li>
                        </ul>
                        <p className="mt-2">
                            These services have their own privacy policies governing their use of your information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-medium text-foreground mb-3">5. Data Sharing</h2>
                        <p>
                            We do not sell, trade, or share your personal information with third parties,
                            except as described in this policy or with your consent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-medium text-foreground mb-3">6. Your Rights</h2>
                        <p>
                            You may access, update, or delete your account and data at any time through
                            the application settings or by contacting us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-medium text-foreground mb-3">7. Changes to This Policy</h2>
                        <p>
                            We may update this privacy policy from time to time. We will notify you of
                            any changes by posting the new policy on this page.
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
