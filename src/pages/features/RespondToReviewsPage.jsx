import { Bell, MessageSquare, PenLine, Plug, Sparkles, SlidersHorizontal } from 'lucide-react'
import {
  CapabilityGrid,
  ClosingCta,
  CrossLinks,
  FeatureRow,
  PageHero,
  StepList,
} from '../../components/marketing/MarketingSections'
import { ImageVisual } from '../../components/marketing/MarketingVisuals'

const capabilities = [
  {
    icon: Bell,
    title: 'Email and in-app alerts',
    text: 'When a new review is submitted or goes live, your business team gets notified so you can respond while it still matters.',
  },
  {
    icon: MessageSquare,
    title: 'Public replies from your dashboard',
    text: 'Write or edit a reply on the Reviews page. It appears under the review on your public profile for every future visitor.',
  },
  {
    icon: PenLine,
    title: 'Edit anytime',
    text: 'Update an existing reply when details change. Customers are emailed on the first reply, not every later edit.',
  },
  {
    icon: Sparkles,
    title: 'Automated review checks',
    text: 'New reviews are screened for spam, policy issues, and risk before they go live. Clear ones publish; others wait for our moderation team.',
  },
  {
    icon: SlidersHorizontal,
    title: 'See what still needs a reply',
    text: 'Your review list shows which feedback is unanswered so nothing sits open for weeks.',
  },
  {
    icon: Plug,
    title: 'Team access',
    text: 'Invite colleagues so the right people can manage reviews and replies for your business.',
  },
]

const steps = [
  {
    title: 'A customer leaves a review',
    text: 'They arrive from your invitation email or find your public profile and submit a rating, title, and comments.',
  },
  {
    title: 'Checks run before it goes live',
    text: 'The review is saved as pending while automated checks look for spam, personal info, duplicates, and policy issues. Clean reviews publish; flagged ones wait for a human moderation check.',
  },
  {
    title: 'Your business is notified',
    text: 'You get an email and an in-app notification so you can open the Reviews page in the business portal and see the new feedback.',
  },
  {
    title: 'You post a public reply',
    text: 'Write your response in the dashboard and publish it. It shows under the review on your profile, and the customer is emailed when you reply for the first time.',
  },
]

export default function RespondToReviewsPage() {
  return (
    <>
      <PageHero
        kicker="Engage with feedback"
        title="Respond to reviews and show the world you care"
        description="Write back to your customers to thank them, sort out problems, and let everyone else see the kind of business you run when something goes wrong."
        primary={{ to: '/setup', label: 'Get started free' }}
        secondary={{ to: '/pricing', label: 'View plans' }}
        visual={
          <ImageVisual
            src="/Respond-to-reviews.png"
            alt="Customer review with a public business reply"
            className="w-full max-w-xl bg-slate-50"
            imgClassName="h-auto w-full object-contain object-top"
          />
        }
      />

      <FeatureRow
        kicker="Public response"
        title="Answer in the open, not in private"
        description="A reply on a review is read by far more people than the person who wrote it. Use it to answer the question behind the complaint, correct anything inaccurate, and thank the customers who took the time to be positive."
        bullets={[
          'Resolve issues where prospective customers can see the resolution.',
          'Give context on what happened without arguing with the reviewer.',
          'Build a visible record of a business that engages rather than ignores.',
        ]}
        tone="muted"
      />

      <FeatureRow
        kicker="Stay on top of feedback"
        title="Know when a review needs your voice"
        description="Replying carefully builds trust, but only if you see the review in time. Check A Review notifies your team and keeps unanswered feedback easy to find in the business portal."
        bullets={[
          'Get email and dashboard alerts when customers leave feedback.',
          'Open Reviews to read the full comment and publish a reply.',
          'Edit a reply later if you need to refine the wording.',
        ]}
      />

      <CapabilityGrid title="What you get" items={capabilities} />

      <StepList
        title="How it works"
        description="How a review moves from a customer’s submission to your public reply in Check A Review."
        steps={steps}
      />

      <CrossLinks
        title="This may also interest you"
        links={[
          {
            to: '/features/profile-page',
            title: 'Profile page customization',
            text: 'Make a strong first impression with a profile that looks like your brand instead of a generic listing.',
            action: 'Customize your profile',
          },
          {
            to: '/solutions/accelerate-conversions',
            title: 'Accelerate conversions with social proof',
            text: 'Show your rating and reviews on your own site, in your ads, and in every email you send.',
            action: 'Accelerate conversions',
          },
        ]}
      />

      <ClosingCta
        title="Start engaging with your customers today"
        description="Upgrade to Starter or above to publish public replies and show customers you listen."
        primary={{ to: '/subscription', label: 'View Starter plan' }}
        secondary={{ to: '/pricing', label: 'View pricing plans' }}
      />
    </>
  )
}
