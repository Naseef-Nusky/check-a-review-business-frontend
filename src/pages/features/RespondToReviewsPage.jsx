import { Bell, MessageSquare, PenLine, Plug, Sparkles, SlidersHorizontal } from 'lucide-react'
import {
  CapabilityGrid,
  ClosingCta,
  CrossLinks,
  FeatureRow,
  PageHero,
  StepList,
} from '../../components/marketing/MarketingSections'
import { InboxVisual, ReplyVisual, WidgetVisual } from '../../components/marketing/MarketingVisuals'

const capabilities = [
  {
    icon: Sparkles,
    title: 'Suggested drafts',
    text: 'A reply is drafted from the review itself, matching its length and tone so you are editing rather than staring at a blank box.',
  },
  {
    icon: PenLine,
    title: 'You approve every word',
    text: 'Nothing is published automatically. Every suggestion is fully editable and only goes out when you send it.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Learns your voice',
    text: 'The more you adjust the drafts, the closer future suggestions land to how your team actually writes.',
  },
  {
    icon: Bell,
    title: 'Notifications that fit',
    text: 'Choose to hear about every review or only the ratings that need attention, so alerts stay useful.',
  },
  {
    icon: Plug,
    title: 'Reply from your own tools',
    text: 'Connect your helpdesk or chat platform and handle reviews next to your other customer conversations.',
  },
  {
    icon: MessageSquare,
    title: 'Full reply history',
    text: 'See what was said, when, and by whom, so anyone picking up the queue has the context.',
  },
]

const steps = [
  {
    title: 'A new review arrives',
    text: 'Someone leaves feedback through your invitation or by finding your profile on their own.',
  },
  {
    title: 'You get notified',
    text: 'An alert reaches you by email or through a connected tool, filtered to the ratings you care about.',
  },
  {
    title: 'You write the reply',
    text: 'Answer from scratch or start from an AI draft, then edit until it sounds like your business.',
  },
  {
    title: 'It goes public',
    text: 'Your reply sits under the review where every future visitor can see how you responded.',
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
        visual={<ReplyVisual />}
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
        visual={<InboxVisual />}
        tone="muted"
      />

      <FeatureRow
        kicker="AI-assisted replies"
        title="Keep quality high when the volume climbs"
        description="Replying carefully to a handful of reviews is easy. Doing it to hundreds a month is where most teams quietly give up. AI drafting keeps the standard consistent without turning your replies into copy-paste."
        bullets={[
          'Draft a tailored response in seconds and refine it before sending.',
          'Stay consistent in tone across everyone who handles the queue.',
          'Spend the time you save on the replies that genuinely need thought.',
        ]}
        visual={<WidgetVisual />}
        reverse
      />

      <CapabilityGrid title="What you get" items={capabilities} />

      <StepList
        title="How it works"
        description="From a new review landing to your reply going live, in four steps."
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
        description="Create a free business account and reply to your first review in minutes."
        primary={{ to: '/setup', label: 'Create free account' }}
        secondary={{ to: '/pricing', label: 'View pricing plans' }}
      />
    </>
  )
}
