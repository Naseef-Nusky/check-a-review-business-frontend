import {
  ClosingCta,
  CrossLinks,
  CustomerStory,
  FeatureRow,
  PageHero,
  StepList,
} from '../components/marketing/MarketingSections'
import { InvitationVisual, SearchVisual, WidgetVisual } from '../components/marketing/MarketingVisuals'

const steps = [
  {
    title: 'Collect reviews',
    text: 'Start by gathering feedback. Automated invitations let you ask every customer rather than only the ones who think to write in.',
  },
  {
    title: 'Improve visibility',
    text: 'Verified reviews give search engines and AI assistants credible material about your brand to draw on.',
  },
  {
    title: 'Improve the service',
    text: 'Reply to what people tell you and act on the themes. Consistent engagement reads as reliability to customers and algorithms alike.',
  },
  {
    title: 'Showcase the trust',
    text: 'Put your rating on your site and in your campaigns so the reputation you have built is visible where it counts.',
  },
]

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        kicker="How Check A Review works"
        title="Turn customer feedback into growth"
        description="Your reviews do more than tell you and your customers about each other. They create the independent, verifiable record that helps people and search engines decide you are worth choosing."
        primary={{ to: '/setup', label: 'Get started free' }}
        secondary={{ to: '/pricing', label: 'View plans' }}
        visual={<WidgetVisual />}
      />

      <StepList
        title="Four steps, start to finish"
        description="How a review goes from a customer's experience to a measurable advantage for your business."
        steps={steps}
      />

      <FeatureRow
        kicker="Win in search"
        title="Get discovered through customer trust"
        description="Every published review lands on your profile and adds to a continuous stream of current, relevant content about your brand. That steady flow is exactly what search engines and AI assistants look for when deciding who to recommend."
        bullets={[
          'A profile that keeps gaining reviews stays visible instead of going stale.',
          'Independent feedback carries weight that your own marketing copy cannot.',
          'Recency matters as much as volume, so consistent collection compounds.',
        ]}
        visual={<SearchVisual />}
      />

      <FeatureRow
        kicker="Automate feedback"
        title="Build credibility without chasing people"
        description="Customers do not only look at your score. They check how many reviews you have and how recent they are. Automated invitations keep both healthy without anyone on your team remembering to send them."
        bullets={[
          'Trigger invitations automatically after a purchase or a completed job.',
          'Send manual invites or share a direct link when it suits the situation.',
          'See which invitations turn into reviews and adjust the timing.',
        ]}
        visual={<InvitationVisual />}
        reverse
        tone="muted"
      />

      <FeatureRow
        kicker="Integrity by default"
        title="Build trust through transparency"
        description="Automated checks screen every submission before it goes live, looking for spam, duplicates, personal information, and guideline breaches. Reviews that pass publish quickly; anything questionable is held for a human to look at."
        bullets={[
          'Every review is checked before publication, not after complaints arrive.',
          'The same rules apply to businesses and reviewers alike.',
          'Suspicious activity can be reported for a closer investigation.',
        ]}
        visual={<WidgetVisual />}
      />

      <CustomerStory
        company="Keyvault — password management software"
        summary="Keyvault collected enough verified reviews in its first month to qualify for star ratings on its search ads."
        body="Showing a rating directly in paid results let the brand establish credibility before anyone reached the landing page. Click-through on the campaign rose sharply, and a larger share of that traffic went on to sign up."
        metric={{ value: '14.5%', label: 'increase in conversions from paid search' }}
      />

      <CrossLinks
        title="Solutions for every stage of growth"
        links={[
          {
            to: '/solutions/accelerate-conversions',
            title: 'Accelerate conversions with social proof',
            text: 'Display your reviews on your site, in emails, and across campaigns to lift conversion at every step.',
            action: 'Accelerate conversions',
          },
          {
            to: '/solutions/improve-with-insights',
            title: 'Use insights to improve your strategy',
            text: 'Read the patterns in your feedback and decide what to fix first with evidence behind you.',
            action: 'Improve with insights',
          },
        ]}
      />

      <ClosingCta
        title="Want reviews to bring more visitors to your site?"
        description="Create a free business account and start collecting verified feedback today."
        primary={{ to: '/setup', label: 'Create free account' }}
        secondary={{ to: '/pricing', label: 'View pricing plans' }}
      />
    </>
  )
}
