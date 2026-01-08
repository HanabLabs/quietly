import { getUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StripeElementsWrapper from '@/components/payment/stripe-wrapper'

export default async function PricingPage() {
    const user = await getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-medium text-foreground mb-4">
                        Keep your Kaizen.
                    </h1>

                    <p className="text-muted mb-8 leading-relaxed">
                        You've been writing small improvements,<br />
                        one day at a time.
                    </p>

                    <div className="mb-8">
                        <div className="text-lg font-medium text-foreground mb-2">
                            Quietly Plus
                        </div>
                        <div className="text-3xl font-medium text-foreground mb-4">
                            $4 <span className="text-lg text-muted">/ month</span>
                        </div>
                        <p className="text-sm text-muted">
                            Keep your full history.<br />
                            Your past entries will remain yours.
                        </p>
                    </div>
                </div>

                <StripeElementsWrapper />

                <div className="mt-8 text-center space-y-4">
                    <p className="text-sm text-muted">
                        You can stop anytime.<br />
                        Your past entries will remain yours.
                    </p>

                    <Link
                        href="/"
                        className="block text-sm text-muted hover:text-foreground transition-colors underline"
                    >
                        Continue without subscribing
                    </Link>
                </div>
            </div>
        </div>
    )
}
