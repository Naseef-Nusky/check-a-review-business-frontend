import { BarChart3, Compass, Eye, ListChecks, Sparkles, Target, TrendingUp, Users } from 'lucide-react'
import {
  CapabilityGrid,
  ClosingCta,
  CrossLinks,
  CustomerStory,
  FeatureRow,
  PageHero,
  StatBand,
} from '../../components/marketing/MarketingSections'
import { InboxVisual, InsightsVisual, WidgetVisual } from '../../components/marketing/MarketingVisuals'

const stats = [
  {
    icon: TrendingUp,
    value: 'Multiples',
    text: 'of their subscription cost is what most teams recover once review insights start steering operational fixes.',
    source: 'Check A Review value analysis, 2026',
  },
  {
    icon: Target,
    value: 'Consistently faster',
    text: 'growth is reported by companies that make decisions from customer data rather than internal opinion.',
    source: 'Check A Review growth research, 2026',
  },
]

const capabilities = [
  {
    icon: Eye,
    title: 'Visitor insights',
    text: 'See who is reading your profile and how often, so you know the audience you are actually reaching.',
  },
  {
    icon: ListChecks,
    title: 'Follow-up questions',
    text: 'Ask reviewers a short private question after they rate you, and collect structured answers alongside the review.',
  },
  {
    icon: Sparkles,
    title: 'AI review summaries',
    text: 'Get a plain-language recap of what customers are saying, with the themes and suggested actions pulled out.',
  },
  {
    icon: Compass,
    title: 'Market context',
    text: 'Compare topics and sentiment against others in your category to tell an industry-wide issue from your own.',
  },
  {
    icon: Users,
    title: 'Competitor benchmarks',
    text: 'Track a handful of rivals side by side and see where you are pulling ahead or slipping behind.',
  },
  {
    icon: BarChart3,
    title: 'Analytics explorer',
    text: 'Slice your review data by rating, period, product, or location to test a hunch in a couple of clicks.',
  },
]

export default function ImproveWithInsightsPage() {
  return (
    <>
      <PageHero
        kicker="By business goal"
        title="Use insights to improve your strategy"
        description="Customer feedback is one of the most honest datasets your business will ever own. Read it properly and it will tell you what to fix, what to keep, and where to go next."
        primary={{ to: '/pricing', label: 'Explore all plans' }}
        secondary={{ to: '/setup', label: 'Get started free' }}
        visual={<InsightsVisual />}
      />

      <StatBand stats={stats} />

      <FeatureRow
        kicker="Find what others miss"
        title="Spot the pattern before it becomes a problem"
        description="A single complaint is an anecdote. Twenty complaints that mention the same step in your process is a roadmap. Grouping feedback by theme turns scattered comments into a ranked list of things worth fixing."
        bullets={[
          'Watch sentiment on individual topics move over time, not just your overall score.',
          'Catch a new issue in the weeks after a launch rather than the quarter after.',
          'Quantify how much of your feedback each problem actually accounts for.',
        ]}
        visual={<InboxVisual />}
      />

      <FeatureRow
        kicker="Decide with evidence"
        title="Replace opinion with something you can point at"
        description="Most internal debates about customer experience are two people trading assumptions. Review data settles them. It shows what customers raised, how often, and whether the last change you made helped."
        bullets={[
          'Bring real numbers to planning instead of the loudest anecdote in the room.',
          'Measure the effect of a fix by watching the relevant theme afterwards.',
          'See where reviews come from and how well your invitations are performing.',
        ]}
        visual={<WidgetVisual />}
        reverse
        tone="muted"
      />

      <CapabilityGrid
        title="Get more out of the feedback you already have"
        description="Everything you need to move from reading individual reviews to understanding what your customer base is telling you as a whole."
        items={capabilities}
      />

      <CustomerStory
        company="Rivermount Recycling — device trade-in service"
        summary="Rivermount Recycling used review insights to catch a dip in satisfaction weeks before it would have shown up in its overall rating."
        body="By tracking themes rather than stars alone, the team noticed a rise in comments about valuation delays. They reworked the step before it spread across the customer base, and the topic disappeared from feedback within two months."
        metric={{ value: '2 months', label: 'from spotting the trend to clearing it from feedback' }}
      />

      <CrossLinks
        title="Learning from insights is one of several ways to build trust and grow"
        links={[
          {
            to: '/solutions/engage-with-feedback',
            title: 'Engage with customer feedback',
            text: 'Reply to reviews and show buyers you are listening, whether the feedback is glowing or difficult.',
            action: 'Engage with feedback',
          },
          {
            to: '/solutions/accelerate-conversions',
            title: 'Accelerate conversions with social proof',
            text: 'Let your customers do the selling. Ratings and reviews shorten the gap between interest and purchase.',
            action: 'Accelerate conversions',
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
