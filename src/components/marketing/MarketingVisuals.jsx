import { Search, Sparkles, Star } from 'lucide-react'

function Stars({ count = 5, size = 'h-3.5 w-3.5' }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`${size} ${index < count ? 'fill-primary-500 text-primary-500' : 'fill-slate-200 text-slate-200'}`}
          strokeWidth={0}
        />
      ))}
    </span>
  )
}

function Frame({ children, className = '' }) {
  return (
    <div className={`rounded-3xl border border-border bg-white p-6 shadow-elevated ${className}`}>{children}</div>
  )
}

/** Renders an illustration from /public with the same framing as the mock UI visuals. */
export function ImageVisual({ src, alt, className = '', imgClassName = '' }) {
  return (
    <div className={`overflow-hidden rounded-3xl border border-border bg-white shadow-elevated ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`block w-full object-cover ${imgClassName || 'h-auto'}`}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

export function ReplyVisual() {
  return (
    <Frame>
      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="flex items-center gap-2">
          <Stars count={2} />
          <span className="text-xs text-slate-500">2 days ago</span>
        </div>
        <p className="mt-2 text-sm font-semibold text-slate-900">Delivery arrived later than promised</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
          The product is good but it turned up four days after the date I was given at checkout.
        </p>
      </div>
      <div className="mt-3 ml-6 rounded-2xl border border-primary-100 bg-primary-50/60 p-4">
        <p className="text-xs font-semibold text-primary-700">Reply from the business</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
          Thanks for flagging this — you were caught by a courier delay we have since moved away from. We have refunded
          your shipping and would like to make the next order right.
        </p>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
        Draft a reply with AI
      </div>
    </Frame>
  )
}

export function WidgetVisual() {
  return (
    <Frame>
      <div className="rounded-2xl border border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Northline Supply</p>
            <div className="mt-1.5 flex items-center gap-2">
              <Stars count={4} />
              <span className="text-sm font-semibold text-slate-900">4.6</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">1,284 reviews</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Trust score</p>
            <p className="text-2xl font-bold text-primary-500">92%</p>
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {['Product page', 'Checkout', 'Email footer'].map((label) => (
          <div key={label} className="rounded-xl bg-slate-50 px-3 py-2.5 text-center text-[11px] font-medium text-slate-600">
            {label}
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function InsightsVisual() {
  const bars = [42, 58, 51, 73, 66, 88, 79]
  return (
    <Frame>
      <p className="text-sm font-semibold text-slate-900">Review volume by month</p>
      <div className="mt-6 flex h-40 items-end gap-3">
        {bars.map((height, index) => (
          <div
            key={index}
            className={`flex-1 rounded-t-lg ${index === bars.length - 2 ? 'bg-primary-500' : 'bg-slate-200'}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-5">
        {[
          { label: 'Delivery speed', value: '+18%' },
          { label: 'Support tone', value: '+9%' },
          { label: 'Returns', value: '-12%' },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-sm font-semibold text-slate-900">{item.value}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function SearchVisual() {
  return (
    <Frame>
      <div className="flex items-center gap-2 rounded-full border border-border px-4 py-2.5">
        <Search className="h-4 w-4 text-slate-400" strokeWidth={1.5} />
        <span className="text-sm text-slate-500">best supplier for workshop tools</span>
      </div>
      <div className="mt-4 space-y-3">
        <div className="rounded-2xl border border-primary-200 bg-primary-50/50 p-4">
          <p className="text-sm font-semibold text-slate-900">Northline Supply</p>
          <div className="mt-1.5 flex items-center gap-2">
            <Stars count={5} />
            <span className="text-xs text-slate-600">4.8 · 1,284 reviews</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            Rated highly for fast dispatch and responsive support.
          </p>
        </div>
        {['Harborline Tools', 'Kestrel Trade Co.'].map((name) => (
          <div key={name} className="rounded-2xl border border-border p-4">
            <p className="text-sm font-medium text-slate-700">{name}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <Stars count={3} />
              <span className="text-xs text-slate-500">3.4</span>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function ProfileVisual() {
  return (
    <Frame className="p-0 overflow-hidden">
      <div className="h-20 bg-gradient-to-r from-primary-500 to-primary-600" />
      <div className="px-6 pb-6">
        <div className="-mt-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-slate-900 text-lg font-bold text-white">
          N
        </div>
        <p className="mt-3 text-base font-semibold text-slate-900">Northline Supply</p>
        <div className="mt-2 flex items-center gap-2">
          <Stars count={5} />
          <span className="text-sm text-slate-600">4.8 · Verified business</span>
        </div>
        <div className="mt-4 rounded-2xl bg-primary-50 px-4 py-3">
          <p className="text-xs font-semibold text-primary-700">Spring offer</p>
          <p className="mt-1 text-xs text-slate-600">15% off first trade order this month.</p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ['1,284', 'Reviews'],
            ['96%', 'Replied'],
            ['4h', 'Avg reply'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-xl bg-slate-50 py-2.5">
              <p className="text-sm font-semibold text-slate-900">{value}</p>
              <p className="text-[10px] text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  )
}

export function InboxVisual() {
  const items = [
    { count: 5, title: 'Exactly what I needed', state: 'Replied' },
    { count: 4, title: 'Solid, minor packaging issue', state: 'Replied' },
    { count: 2, title: 'Order took too long', state: 'Needs reply' },
  ]

  return (
    <Frame>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Review inbox</p>
        <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700">
          1 awaiting reply
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.title} className="rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <Stars count={item.count} />
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  item.state === 'Replied' ? 'bg-slate-100 text-slate-600' : 'bg-primary-100 text-primary-700'
                }`}
              >
                {item.state}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-slate-800">{item.title}</p>
          </li>
        ))}
      </ul>
    </Frame>
  )
}

export function InvitationVisual() {
  return (
    <Frame>
      <div className="rounded-2xl border border-border p-4">
        <p className="text-[11px] uppercase tracking-widest text-slate-400">To</p>
        <p className="text-sm text-slate-700">customer@example.com</p>
        <div className="mt-3 border-t border-border pt-3">
          <p className="text-sm font-semibold text-slate-900">How did we do?</p>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            Your order arrived last week. Sharing a quick review helps other buyers decide.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Stars count={5} size="h-5 w-5" />
          </div>
          <div className="mt-3 inline-flex rounded-full bg-primary-500 px-4 py-2 text-xs font-semibold text-white">
            Write a review
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          ['Automatic', '68%'],
          ['Manual', '22%'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 px-3 py-2.5">
            <p className="text-sm font-semibold text-slate-900">{value}</p>
            <p className="text-[10px] text-slate-500">{label} invitations</p>
          </div>
        ))}
      </div>
    </Frame>
  )
}
