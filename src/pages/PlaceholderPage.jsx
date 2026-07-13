export default function PlaceholderPage({ title, description }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-ink">{title}</h2>
      <p className="mt-1 text-sm text-ink-muted">{description}</p>
      <div className="card mt-6 p-8 text-sm text-ink-muted">
        This page is ready for your business portal features.
      </div>
    </div>
  )
}
