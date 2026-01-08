'use client'

import { useState } from 'react'
import { signUp } from '@/lib/auth/actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Footer from '@/components/layout/footer'

export default function SignUpPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)

        const result = await signUp(email, password)

        if (result.success) {
            router.push(`/verify?email=${encodeURIComponent(email)}`)
        } else {
            setError(result.error || 'Something went wrong')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-12">
                        <h1 className="text-2xl font-medium text-foreground mb-2">Quietly</h1>
                        <p className="text-sm text-muted">Start your quiet improvements</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm text-muted mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-accent transition-colors text-foreground"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm text-muted mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-accent transition-colors text-foreground"
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-muted mt-2">At least 8 characters</p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm text-muted mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-accent transition-colors text-foreground"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-muted">
                            Already have an account?{' '}
                            <Link href="/login" className="text-foreground hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
