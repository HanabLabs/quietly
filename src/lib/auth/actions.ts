'use server'

import { createClient } from '@/lib/supabase/server'
import { sendVerificationCode } from '@/lib/email/send-verification'
import { redirect } from 'next/navigation'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const getAdminClient = () => {
    return createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function signUp(email: string, password: string) {
    const supabase = await createClient()

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: undefined,
            data: {
                verification_code: verificationCode,
                verification_code_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
                email_verified: false,
            },
        },
    })

    if (error) {
        return { success: false, error: error.message }
    }

    await sendVerificationCode(email, verificationCode)

    return { success: true, email, userId: data.user?.id }
}

export async function resendVerificationCode(email: string) {
    const adminClient = getAdminClient()

    const { data: { users }, error } = await adminClient.auth.admin.listUsers()

    if (error) {
        return { success: false, error: 'Failed to find user' }
    }

    const user = users.find(u => u.email === email)

    if (!user) {
        return { success: false, error: 'User not found' }
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    await adminClient.auth.admin.updateUserById(user.id, {
        user_metadata: {
            verification_code: verificationCode,
            verification_code_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        },
    })

    await sendVerificationCode(email, verificationCode)

    return { success: true }
}

export async function verifyCode(email: string, code: string) {
    const adminClient = getAdminClient()

    const { data: { users }, error } = await adminClient.auth.admin.listUsers()

    if (error) {
        return { success: false, error: 'Failed to find user' }
    }

    const user = users.find(u => u.email === email)

    if (!user) {
        return { success: false, error: 'User not found' }
    }

    const storedCode = user.user_metadata?.verification_code
    const expiresAt = user.user_metadata?.verification_code_expires

    if (!storedCode || !expiresAt) {
        return { success: false, error: 'Verification code not found' }
    }

    if (new Date() > new Date(expiresAt)) {
        return { success: false, error: 'Verification code has expired' }
    }

    const trimmedCode = code.trim()
    const trimmedStoredCode = storedCode.toString().trim()

    if (trimmedCode !== trimmedStoredCode) {
        return { success: false, error: 'Invalid verification code' }
    }

    await adminClient.auth.admin.updateUserById(user.id, {
        user_metadata: {
            verification_code: null,
            verification_code_expires: null,
            email_verified: true,
        },
        email_confirmed_at: new Date().toISOString(),
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
