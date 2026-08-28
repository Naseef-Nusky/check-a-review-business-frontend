import { useEffect, useRef, useState } from 'react'

function formatStatValue(target, progress, suffix, decimals) {
  const value = target * progress
  if (decimals > 0) return `${value.toFixed(decimals)}${suffix}`
  return `${Math.round(value)}${suffix}`
}

function useInView() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || inView) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [inView])

  return [ref, inView]
}

function AnimatedNumber({ target, suffix = '', decimals = 0, active, duration = 1400 }) {
  const [display, setDisplay] = useState(() => formatStatValue(0, 0, suffix, decimals))
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!active) return undefined

    if (reducedMotion) {
      setDisplay(formatStatValue(target, 1, suffix, decimals))
      return undefined
    }

    let frameId = 0
    const start = performance.now()

    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(1, elapsed / duration)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(formatStatValue(target, eased, suffix, decimals))
      if (progress < 1) frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [active, decimals, duration, reducedMotion, suffix, target])

  return <span>{display}</span>
}

export default function TrustStatsBand({
  title = "The world's most trusted feedback platform",
  stats = [],
}) {
  const [sectionRef, inView] = useInView()

  return (
    <section ref={sectionRef} className="trust-stats-section border-y border-white/10">
      <div className="trust-stats-bg" aria-hidden="true" />
      <div className="trust-stats-overlay" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-7xl px-3 py-12 sm:px-6 sm:py-16 lg:px-8">
        <h2
          className={`trust-stats-title mx-auto max-w-full text-center text-[10px] font-semibold leading-none tracking-tighter text-white whitespace-nowrap min-[360px]:text-xs min-[400px]:text-sm sm:text-2xl sm:leading-tight sm:tracking-tight sm:whitespace-normal md:text-3xl ${
            inView ? 'is-visible' : ''
          }`}
        >
          {title}
        </h2>

        <div className="mt-8 grid grid-cols-3 gap-1 sm:mt-12 sm:gap-0">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`trust-stat-item text-center px-1 sm:px-8 ${
                index > 0 ? 'border-l border-white/15' : ''
              } ${inView ? 'is-visible' : ''}`}
              style={{ '--stat-delay': `${180 + index * 140}ms` }}
            >
              <p className="text-xl font-semibold tracking-tight text-primary-400 tabular-nums min-[360px]:text-2xl sm:text-4xl lg:text-5xl">
                <AnimatedNumber
                  target={stat.numeric}
                  suffix={stat.suffix}
                  decimals={stat.decimals || 0}
                  active={inView}
                  duration={1500 + index * 150}
                />
              </p>
              <p className="mt-1 text-[9px] font-semibold leading-tight text-white min-[360px]:text-[10px] sm:mt-3 sm:text-sm sm:leading-normal">
                {stat.label}
              </p>
              {stat.detail ? (
                <p className="mt-1 hidden text-sm text-slate-300 sm:block">{stat.detail}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
