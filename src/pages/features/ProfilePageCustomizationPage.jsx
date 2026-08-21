import { Eye, Image, Megaphone, Search } from 'lucide-react'
import {
  ClosingCta,
  CrossLinks,
  PageHero,
} from '../../components/marketing/MarketingSections'
import { ImageVisual } from '../../components/marketing/MarketingVisuals'

const profileFeatures = [
  {
    icon: Image,
    kicker: 'Brand-aligned design',
    title: 'Introduce your business properly',
    description:
      'Add your logo, a cover image, and a description in your own words so visitors recognise the brand they clicked through to find.',
    points: [
      'Logo and cover sized for desktop and mobile',
      'Clear description of what you do',
      'Accurate contact details, categories, and links',
    ],
  },
  {
    icon: Eye,
    kicker: 'Keep the focus on you',
    title: 'Stay the centre of attention',
    description:
      'Control what appears alongside your reviews so visitors stay on your story instead of drifting to a competitor.',
    points: [
      'Limit comparative clutter next to your listing',
      'Feature the reviews that best represent you',
      'Present your strengths in your own order',
    ],
  },
  {
    icon: Search,
    kicker: 'Enhanced visibility',
    title: 'Get found by people already searching',
    description:
      'Fresh, verified reviews give search engines and AI assistants something substantial to reference when recommending businesses like yours.',
    points: [
      'Stay relevant in search with new review content',
      'Give AI answer engines a credible source to cite',
      'Every new review strengthens your listing',
    ],
  },
  {
    icon: Megaphone,
    kicker: 'Promotional space',
    title: 'Catch attention at the right moment',
    description:
      'Visitors reading your reviews are already weighing a purchase. A current offer on your profile turns interest into action.',
    points: [
      'Highlight seasonal offers where buyers will see them',
      'Point visitors to the page you care about most',
      'Update the message whenever your campaign changes',
    ],
  },
]

export default function ProfilePageCustomizationPage() {
  return (
    <>
      <PageHero
        kicker="Engage with feedback"
        title="Give potential customers a strong first impression"
        description="Your profile is often the first place a buyer meets your brand properly. Make it look like you, and give visitors a reason to keep reading."
        primary={{ to: '/setup', label: 'Get started free' }}
        secondary={{ to: '/pricing', label: 'View plans' }}
        visual={
          <ImageVisual
            src="/profile-page-hero.png"
            alt="Harbor Lane Coffee public profile with ratings and AI summary"
            className="w-full max-w-xl bg-slate-50"
            imgClassName="h-auto w-full object-contain object-top"
          />
        }
      />

      <section className="relative overflow-hidden border-y border-border bg-slate-950 py-16 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,64,129,0.35), transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,158,187,0.2), transparent 35%)',
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">Worth knowing</p>
          <p className="mt-4 text-xl leading-relaxed text-white sm:text-2xl">
            People arrive at a review profile already close to a decision. What they find there often settles it, which
            makes it one of the highest-intent pages your brand has.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="section-kicker">What you can shape</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Everything on your profile, working as one first impression
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              One public page carries your branding, reviews, visibility, and offers. Keep each part clear so buyers
              trust what they see.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {profileFeatures.map(({ icon: Icon, kicker, title, description, points }, index) => (
              <article
                key={title}
                className="flex flex-col rounded-[1.75rem] border border-border bg-slate-50/80 p-6 shadow-soft sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary-600 ring-1 ring-border">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-slate-300">0{index + 1}</span>
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">{kicker}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
                <ul className="mt-5 space-y-2.5 border-t border-border/80 pt-5">
                  {points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CrossLinks
        title="This may also interest you"
        links={[
          {
            to: '/features/respond-to-reviews',
            title: 'Respond to reviews',
            text: 'Write back to customers to thank them, resolve problems, and show everyone else how you handle feedback.',
            action: 'Respond to reviews',
          },
          {
            to: '/solutions/accelerate-conversions',
            title: 'Accelerate conversions with social proof',
            text: 'Take your rating beyond your profile and onto your own site, ads, and emails.',
            action: 'Accelerate conversions',
          },
        ]}
      />

      <ClosingCta
        title="Ready to make your profile work harder?"
        description="Set up your business account and customize your profile in a few minutes."
        primary={{ to: '/setup', label: 'Create free account' }}
        secondary={{ to: '/pricing', label: 'View pricing plans' }}
        backgroundImage="/Profile-cta-bg.png"
      />
    </>
  )
}
