'use server'

import { createClient } from '@/lib/supabase/server'
import { sendVerificationCode } from '@/lib/email/send-verification'
import { redirect } from 'next/navigation'

export async function signUp(email: string, password: string) {
    const supabase = await createClient()

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                verification_code: verificationCode,
                verification_code_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
            },
        },
    })

    if (error) {
        return { success: false, error: error.message }
    }

    // Send verification email
    await sendVerificationCode(email, verificationCode)

    return { success: true, email }
}

export async function resendVerificationCode(email: string) {
    const supabase = await createClient()

    // Get user by email
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { success: false, error: 'User not found' }
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Update user metadata with new code
    await supabase.auth.updateUser({
        data: {
            verification_code: verificationCode,
            verification_code_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        },
    })

    // Send verification email
    await sendVerificationCode(email, verificationCode)

    return { success: true }
}

export async function verifyCode(email: string, code: string) {
    const supabase = await createClient()

    // Get user by email
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { success: false, error: 'User not found' }
    }

    const storedCode = user.user_metadata.verification_code
    const expiresAt = user.user_metadata.verification_code_expires

    if (!storedCode || !expiresAt) {
        return { success: false, error: 'Verification code not found' }
    }

    if (new Date() > new Date(expiresAt)) {
        return { success: false, error: 'Verification code has expired' }
    }

    if (code !== storedCode) {
        return { success: false, error: 'Invalid verification code' }
    }

    // Update user as verified
    await supabase.auth.updateUser({
        data: {
            verification_code: null,
            verification_code_expires: null,
            email_verified: true,
        },
    })

    return { success: true }
}

export async function signIn(email: string, password: string) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { success: false, error: error.message }
    }

    redirect('/')
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

export async function getUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}
