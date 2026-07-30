import {
  ClosingCta,
  CrossLinks,
  FeatureRow,
  PageHero,
} from '../../components/marketing/MarketingSections'
import { ProfileVisual, SearchVisual, WidgetVisual } from '../../components/marketing/MarketingVisuals'

export default function ProfilePageCustomizationPage() {
  return (
    <>
      <PageHero
        kicker="Engage with feedback"
        title="Give potential customers a strong first impression"
        description="Your profile is often the first place a buyer meets your brand properly. Make it look like you, and give visitors a reason to keep reading."
        primary={{ to: '/setup', label: 'Get started free' }}
        secondary={{ to: '/pricing', label: 'View plans' }}
        visual={<ProfileVisual />}
      />

      <section className="border-y border-border bg-slate-50 py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="section-kicker">Worth knowing</p>
          <p className="mt-4 text-xl leading-relaxed text-slate-900 sm:text-2xl">
            People arrive at a review profile already close to a decision. What they find there often settles it, which
            makes it one of the highest-intent pages your brand has.
          </p>
        </div>
      </section>

      <FeatureRow
        kicker="Brand-aligned design"
        title="Introduce your business properly"
        description="Add your logo, a cover image, and a description in your own words so visitors recognise the brand they clicked through to find. A profile that matches your site reassures people they are in the right place."
        bullets={[
          'Upload a logo and cover image sized for both desktop and mobile.',
          'Write a description that explains what you do and who you do it for.',
          'Keep contact details, categories, and links accurate and current.',
        ]}
        visual={<WidgetVisual />}
      />

      <FeatureRow
        kicker="Keep the focus on you"
        title="Stay the centre of attention"
        description="Once someone has reached your profile, the last thing you want is a path straight to a competitor. Control what appears alongside your reviews so visitors stay on your story."
        bullets={[
          'Choose how much comparative content sits next to your listing.',
          'Feature the reviews that best represent the experience you offer.',
          'Present your strengths in your own order rather than a default one.',
        ]}
        visual={<ProfileVisual />}
        reverse
        tone="muted"
      />

      <FeatureRow
        kicker="Enhanced visibility"
        title="Get found by people already searching"
        description="A profile carrying fresh, verified reviews gives search engines and AI assistants something substantial to reference. That means more of the people looking for a business like yours actually come across you."
        bullets={[
          'Fresh review content keeps your listing relevant in search results.',
          'Verified feedback gives AI answer engines a credible source to cite.',
          'Every new review adds to the material working in your favour.',
        ]}
        visual={<SearchVisual />}
      />

      <FeatureRow
        kicker="Promotional space"
        title="Catch attention at the right moment"
        description="Visitors reading your reviews are already weighing up a purchase. A current offer or announcement on your profile turns that interest into a first order rather than a bookmark."
        bullets={[
          'Highlight a seasonal offer or a new product line where buyers will see it.',
          'Point visitors towards the page you most want them to reach.',
          'Update the message whenever your campaign changes.',
        ]}
        visual={<WidgetVisual />}
        reverse
        tone="muted"
      />

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
      />
    </>
  )
}
