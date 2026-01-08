'use server'

import { createClient } from '@/lib/supabase/server'
import { startOfWeek, differenceInDays } from 'date-fns'

export async function checkAndShowWeeklyReflection() {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { shouldShow: false, message: null, daysRecorded: 0 }
    }

    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Monday
    const weekStartDate = weekStart.toISOString().split('T')[0]

    // Check if we already showed reflection for this week
    const { data: existingReflection } = await supabase
        .from('weekly_reflections')
        .select('id')
        .eq('user_id', user.id)
        .eq('week_start_date', weekStartDate)
        .single()

    if (existingReflection) {
        // Already shown this week
        return { shouldShow: false, message: null, daysRecorded: 0 }
    }

    // Check if it's a new week (Monday) and we have data from last week
    const dayOfWeek = today.getDay()
    const isMonday = dayOfWeek === 1

    if (!isMonday) {
        // Only show on Mondays
        return { shouldShow: false, message: null, daysRecorded: 0 }
    }

    // Get last week's kaizens
    const lastWeekStart = new Date(weekStart)
    lastWeekStart.setDate(lastWeekStart.getDate() - 7)
    const lastWeekEnd = new Date(weekStart)
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1)

    const { data: lastWeekKaizens } = await supabase
        .from('kaizens')
        .select('id, date')
        .eq('user_id', user.id)
        .gte('date', lastWeekStart.toISOString().split('T')[0])
        .lte('date', lastWeekEnd.toISOString().split('T')[0])

    const daysRecorded = lastWeekKaizens?.length || 0

    if (daysRecorded === 0) {
        // No activity last week, don't show reflection
        return { shouldShow: false, message: null, daysRecorded: 0 }
    }

    // Generate appropriate message based on days recorded
    let message = ''
    if (daysRecorded === 1) {
        message = "Last week, you made one small improvement.\nThat's meaningful."
    } else if (daysRecorded === 2 || daysRecorded === 3) {
        message = "You showed up a few times last week.\nNothing dramatic. Still meaningful."
    } else if (daysRecorded === 4 || daysRecorded === 5) {
        message = "This past week, you quietly improved a few small things.\nThat's enough. Let's continue."
    } else if (daysRecorded >= 6) {
        message = "You showed up several times last week.\nSmall steps, steadily taken."
    }

    return { shouldShow: true, message, daysRecorded }
}

export async function markWeeklyReflectionShown() {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { success: false }
    }

    const today = new Date()
    const weekStart = startOfWeek(today, { weekStartsOn: 1 })
    const weekStartDate = weekStart.toISOString().split('T')[0]

    // Get last week's count
    const lastWeekStart = new Date(weekStart)
    lastWeekStart.setDate(lastWeekStart.getDate() - 7)
    const lastWeekEnd = new Date(weekStart)
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1)

    const { data: lastWeekKaizens } = await supabase
        .from('kaizens')
        .select('id')
        .eq('user_id', user.id)
        .gte('date', lastWeekStart.toISOString().split('T')[0])
        .lte('date', lastWeekEnd.toISOString().split('T')[0])

    const daysRecorded = lastWeekKaizens?.length || 0

    await supabase
        .from('weekly_reflections')
        .insert({
            user_id: user.id,
            week_start_date: weekStartDate,
            days_recorded: daysRecorded,
        })

    return { success: true }
}
