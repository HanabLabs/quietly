'use client'

import { useState, Suspense } from 'react'
import { verifyCode, resendVerificationCode } from '@/lib/auth/actions'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function VerifyForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get('email') || ''

    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [resendSuccess, setResendSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const result = await verifyCode(email, code)

        if (result.success) {
            router.push('/login?verified=true')
        } else {
            setError(result.error || 'Invalid code')
            setLoading(false)
        }
    }

    const handleResend = async () => {
        setResending(true)
        setError('')
        setResendSuccess(false)

        const result = await resendVerificationCode(email)

        if (result.success) {
            setResendSuccess(true)
            setTimeout(() => setResendSuccess(false), 3000)
        } else {
            setError('Failed to resend code')
        }

        setResending(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
            <div className="w-full max-w-sm">
                <div className="text-center mb-12">
                    <h1 className="text-2xl font-medium text-foreground mb-2">Verify your email</h1>
                    <p className="text-sm text-muted">
                        We sent a 6-digit code to<br />
                        <span className="text-foreground">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="code" className="block text-sm text-muted mb-2">
                            Verification code
                        </label>
                        <input
                            id="code"
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            required
                            maxLength={6}
                            pattern="\d{6}"
                            className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-accent transition-colors text-center text-2xl tracking-widest font-mono text-foreground"
                            placeholder="000000"
                        />
                        <p className="text-xs text-muted mt-2">Code expires in 10 minutes</p>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    )}

                    {resendSuccess && (
                        <p className="text-sm text-green-600 dark:text-green-400">Code resent successfully</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || code.length !== 6}
                        className="w-full py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </form>

                <div className="mt-8 space-y-3">
                    <div className="text-center">
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            className="text-sm text-muted hover:text-foreground transition-colors disabled:opacity-50"
                        >
                            {resending ? 'Resending...' : 'Resend code'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/signup"
                            className="text-sm text-muted hover:text-foreground transition-colors"
                        >
                            ← Back to signup
                        </Link>
                    </div>

                    <div className="text-center text-sm text-muted pt-4">
                        <p>Didn't receive a code? Check your spam folder</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-muted">Loading...</div>
            </div>
        }>
            <VerifyForm />
        </Suspense>
    )
}
