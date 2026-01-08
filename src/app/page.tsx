import { getUser, signOut } from '@/lib/auth/actions'
import { getKaizens, getTodayKaizen } from '@/lib/kaizen/actions'
import { checkAndShowWeeklyReflection } from '@/lib/reflection/check-weekly'
import { shouldShowPricingNotification } from '@/lib/pricing/check-notification'
import { redirect } from 'next/navigation'
import KaizenForm from '@/components/kaizen/kaizen-form'
import KaizenList from '@/components/kaizen/kaizen-list'
import WeeklyReflection from '@/components/reflection/weekly-reflection'
import QuietPricingNotification from '@/components/pricing/quiet-notification'
import Link from 'next/link'

export default async function HomePage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const [todayResult, kaizensResult, reflectionResult, pricingResult] = await Promise.all([
    getTodayKaizen(),
    getKaizens(),
    checkAndShowWeeklyReflection(),
    shouldShowPricingNotification(),
  ])

  const todayKaizen = todayResult.kaizen
  const kaizens = kaizensResult.kaizens || []
  const showReflection = reflectionResult.shouldShow
  const reflectionMessage = reflectionResult.message
  const showPricing = pricingResult.shouldShow

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-16 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-medium text-foreground mb-1">Quietly</h1>
            <p className="text-sm text-muted">Small improvements, one day at a time.</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/settings"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Settings
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        {/* Weekly Reflection */}
        {showReflection && reflectionMessage && (
          <WeeklyReflection message={reflectionMessage} />
        )}

        {/* Pricing Notification */}
        {showPricing && <QuietPricingNotification />}

        {/* Kaizen Form */}
        <KaizenForm initialValue={todayKaizen?.content || ''} />

        {/* Kaizen List */}
        <div className="border-t border-border pt-12">
          <KaizenList kaizens={kaizens} />
        </div>
      </div>
    </div>
  )
}
