import { Building2, MessageSquare, Star, TrendingUp } from 'lucide-react'

const stats = [
  { label: 'Average rating', value: '4.8', icon: Star },
  { label: 'Total reviews', value: '234', icon: MessageSquare },
  { label: 'Trust score', value: '92%', icon: TrendingUp },
  { label: 'Invitations sent', value: '156', icon: Building2 },
]

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Dashboard</h2>
        <p className="mt-1 text-sm text-ink-muted">Overview of your reputation and review activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-5">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <Icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <p className="text-3xl font-semibold tracking-tight text-ink tabular-nums">{value}</p>
            <p className="mt-1 text-sm text-ink-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-semibold text-ink">Recent reviews</h3>
          <p className="mt-2 text-sm text-ink-muted">Latest customer feedback will appear here.</p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-ink">Quick actions</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• Invite customers to leave a review</li>
            <li>• Reply to unpublished feedback</li>
            <li>• Embed your review widget</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
