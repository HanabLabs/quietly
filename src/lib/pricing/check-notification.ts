'use server'

import { createClient } from '@/lib/supabase/server'
import { differenceInDays } from 'date-fns'

export async function shouldShowPricingNotification() {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { shouldShow: false }
    }

    // Check if already shown
    const { data: existing } = await supabase
        .from('pricing_notifications')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (existing) {
        return { shouldShow: false }
    }

    // Check subscription status - don't show to paid users
    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, first_kaizen_date')
        .eq('id', user.id)
        .single()

    if (profile?.subscription_status === 'quiet_plus') {
        return { shouldShow: false }
    }

    // Check if user has been active for 15+ days
    if (!profile?.first_kaizen_date) {
        return { shouldShow: false }
    }

    const daysSinceFirst = differenceInDays(
        new Date(),
        new Date(profile.first_kaizen_date)
    )

    return { shouldShow: daysSinceFirst >= 15 }
}

export async function markPricingNotificationShown() {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { success: false }
    }

    await supabase
        .from('pricing_notifications')
        .insert({
            user_id: user.id,
        })

    return { success: true }
}
