import { Filter, Flag, Inbox, LineChart, MessageSquare, Plug, Sparkles, ThumbsUp } from 'lucide-react'
import {
  CapabilityGrid,
  ClosingCta,
  CrossLinks,
  CustomerStory,
  FeatureRow,
  PageHero,
  StatBand,
} from '../../components/marketing/MarketingSections'
import { ImageVisual } from '../../components/marketing/MarketingVisuals'

const stats = [
  {
    icon: ThumbsUp,
    value: '9 in 10',
    text: 'shoppers say they would consider a business that answers every review, against roughly half for one that stays silent.',
    source: 'Check A Review buyer sentiment panel, 2026',
  },
  {
    icon: MessageSquare,
    value: 'Two thirds',
    text: 'of buyers would rather deal with a company that owns its mistakes in public than one with a spotless record.',
    source: 'Check A Review trust study, 2026',
  },
]

const capabilities = [
  {
    icon: Sparkles,
    title: 'AI-assisted replies',
    text: 'Generate a warm, on-brand first draft in seconds, then edit it until it sounds like you before anything is posted.',
  },
  {
    icon: Filter,
    title: 'Tagging and filtering',
    text: 'Group feedback by theme, product, or location so recurring problems surface instead of hiding in the feed.',
  },
  {
    icon: Inbox,
    title: 'One review inbox',
    text: 'Every piece of feedback lands in a single queue, so nothing sits unanswered for weeks.',
  },
  {
    icon: Plug,
    title: 'Works with your helpdesk',
    text: 'Handle replies from the tools your support team already lives in rather than adding another tab.',
  },
  {
    icon: LineChart,
    title: 'Reply metrics',
    text: 'Track how much of your feedback gets a response and how quickly, then set targets your team can hit.',
  },
  {
    icon: Flag,
    title: 'Report suspicious reviews',
    text: 'Flag anything that looks fake or abusive and our moderation team takes a closer look.',
  },
]

export default function EngageWithFeedbackPage() {
  return (
    <>
      <PageHero
        kicker="By business goal"
        title="Engage with customer feedback"
        description="Show customers you are actually listening. Reply to reviews, resolve problems in the open, and let what people tell you shape what you do next."
        primary={{ to: '/pricing', label: 'Explore all plans' }}
        secondary={{ to: '/setup', label: 'Get started free' }}
        visual={
          <ImageVisual
            src="/Engage-with-feedback-hero.png"
            alt="A business owner reviewing customer feedback on a phone"
          />
        }
      />

      <StatBand stats={stats} />

      <FeatureRow
        kicker="Recover unhappy customers"
        title="Turn a bad experience into a second chance"
        description="People rarely expect perfection. They expect to be heard. Answering a critical review calmly, with a real fix attached, often does more for your reputation than the complaint ever cost you."
        bullets={[
          'Get notified the moment a low rating lands so you can respond while it still matters.',
          'Reply publicly to show future buyers how you handle things when they go wrong.',
          'Track whether reviewers update their rating after you step in.',
        ]}
        visual={
          <ImageVisual
            src="/Engage-recover-customers.png"
            alt="Support manager calmly replying to a critical customer review"
          />
        }
      />

      <FeatureRow
        kicker="Win over new buyers"
        title="Let your replies do the convincing"
        description="Someone comparing you against a competitor reads more than star ratings. They read how you talk to people. A thoughtful reply on a three-star review can be the detail that decides it."
        bullets={[
          'Every reply is public and permanent social proof of how you treat customers.',
          'Consistent tone across hundreds of replies builds a recognisable brand voice.',
          'Reviews with replies give search engines and AI assistants more to work with.',
        ]}
        visual={
          <ImageVisual
            src="/Engage-public-replies.png"
            alt="Prospective customer reading public business replies on a review profile"
          />
        }
        reverse
        tone="muted"
      />

      <CapabilityGrid
        title="Everything you need to stay on top of feedback"
        description="Tools that make replying to hundreds of reviews a routine part of the week rather than a project nobody has time for."
        items={capabilities}
      />

      <CustomerStory
        company="Petal & Post — same-day flower delivery"
        summary="Petal & Post lifted website conversions by more than a third after committing to answer every review of three stars or lower."
        body="Rather than avoiding criticism, the team treated each low rating as a support ticket in public. Customers noticed that complaints got answered within hours, and prospective buyers browsing the profile saw a business that fixes things instead of one that hides."
        metric={{ value: '37%', label: 'increase in website conversions within two quarters' }}
        image="/Engage-customer-story.png"
        imageAlt="Florist arranging flowers while checking customer review feedback"
      />

      <CrossLinks
        title="Engaging with feedback is one of several ways to build trust and grow"
        links={[
          {
            to: '/solutions/accelerate-conversions',
            title: 'Accelerate conversions with social proof',
            text: 'Let your customers do the selling. Ratings and reviews shorten the gap between interest and purchase.',
            action: 'Accelerate conversions',
          },
          {
            to: '/solutions/improve-with-insights',
            title: 'Use insights to improve your strategy',
            text: 'Do not let feedback go to waste. Turn review data into decisions about what to fix first.',
            action: 'Improve with insights',
          },
        ]}
      />

      <ClosingCta
        title="Not sure which plan fits?"
        description="Compare features and pricing to find the option that matches the size of your business today."
        primary={{ to: '/pricing', label: 'Explore all plans' }}
        secondary={{ to: '/setup', label: 'Create free account' }}
      />
    </>
  )
}
