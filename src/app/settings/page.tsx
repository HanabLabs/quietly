import { getUser, signOut } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Footer from '@/components/layout/footer'

export default async function SettingsPage() {
    const user = await getUser()

    if (!user) {
        redirect('/login')
    }

    const supabase = await createClient()
    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single()

    const isPaid = profile?.subscription_status === 'quiet_plus'

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <div className="flex-1">
                <div className="max-w-2xl mx-auto px-6 py-12">
                    {/* Header */}
                    <div className="mb-12">
                        <Link
                            href="/"
                            className="text-sm text-muted hover:text-foreground transition-colors mb-4 inline-block"
                        >
                            ← Back
                        </Link>
                        <h1 className="text-2xl font-medium text-foreground">Settings</h1>
                    </div>

                    {/* Account Section */}
                    <div className="mb-12">
                        <h2 className="text-sm font-medium text-foreground mb-4">Account</h2>
                        <div className="bg-background border border-border rounded-lg p-6">
                            <div className="mb-4">
                                <p className="text-xs text-muted mb-1">Email</p>
                                <p className="text-sm text-foreground">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Section */}
                    <div className="mb-12">
                        <h2 className="text-sm font-medium text-foreground mb-4">Subscription</h2>
                        <div className="bg-background border border-border rounded-lg p-6">
                            <div className="mb-4">
                                <p className="text-xs text-muted mb-1">Plan</p>
                                <p className="text-sm text-foreground">{isPaid ? 'Quiet Plus' : 'Free'}</p>
                            </div>
                            {!isPaid && (
                                <Link
                                    href="/pricing"
                                    className="text-sm text-foreground hover:underline"
                                >
                                    Upgrade to Quietly Plus
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Sign Out */}
                    <div>
                        <form action={signOut}>
                            <button
                                type="submit"
                                className="text-sm text-muted hover:text-foreground transition-colors"
                            >
                                Sign out
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
