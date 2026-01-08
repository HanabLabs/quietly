'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createKaizen(content: string) {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { success: false, error: 'Not authenticated' }
    }

    // Check if user already has a Kaizen for today
    const today = new Date().toISOString().split('T')[0]

    const { data: existing } = await supabase
        .from('kaizens')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

    if (existing) {
        // Update existing Kaizen
        const { error } = await supabase
            .from('kaizens')
            .update({ content, updated_at: new Date().toISOString() })
            .eq('id', existing.id)

        if (error) {
            return { success: false, error: error.message }
        }
    } else {
        // Create new Kaizen
        const { error } = await supabase
            .from('kaizens')
            .insert({
                user_id: user.id,
                content,
                date: today,
            })

        if (error) {
            return { success: false, error: error.message }
        }

        // Update first_kaizen_date if this is the first Kaizen
        const { data: profile } = await supabase
            .from('profiles')
            .select('first_kaizen_date')
            .eq('id', user.id)
            .single()

        if (profile && !profile.first_kaizen_date) {
            await supabase
                .from('profiles')
                .update({ first_kaizen_date: today })
                .eq('id', user.id)
        }
    }

    revalidatePath('/')
    return { success: true }
}

export async function getKaizens(limit?: number) {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { success: false, kaizens: [] }
    }

    // Get user subscription status
    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single()

    const isFree = !profile || profile.subscription_status === 'free'
    const effectiveLimit = isFree ? 14 : (limit || 1000)

    const { data: kaizens, error } = await supabase
        .from('kaizens')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(effectiveLimit)

    if (error) {
        return { success: false, error: error.message, kaizens: [] }
    }

    return { success: true, kaizens: kaizens || [] }
}

export async function getTodayKaizen() {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { success: false, kaizen: null }
    }

    const today = new Date().toISOString().split('T')[0]

    const { data: kaizen, error } = await supabase
        .from('kaizens')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

    if (error && error.code !== 'PGRST116') {
        return { success: false, error: error.message, kaizen: null }
    }

    return { success: true, kaizen }
}
