import { Image, Mail, Paintbrush, Search, Share2, TrendingUp, Wallet, LayoutGrid } from 'lucide-react'
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
    icon: TrendingUp,
    value: 'Around a fifth',
    text: 'more conversions is what businesses typically report after putting their rating and reviews on key pages.',
    source: 'Check A Review customer benchmark, 2026',
  },
  {
    icon: Wallet,
    value: 'Far more clicks',
    text: 'go to ads that carry a real customer quote than to the same ad without one.',
    source: 'Check A Review advertising study, 2026',
  },
]

const capabilities = [
  {
    icon: LayoutGrid,
    title: 'Website widgets',
    text: 'Drop your rating and latest reviews onto any page with a single snippet of code.',
  },
  {
    icon: Paintbrush,
    title: 'Flexible styling',
    text: 'Adjust size, layout, and colours so the widget looks like part of your site rather than a bolted-on badge.',
  },
  {
    icon: Image,
    title: 'Ad asset builder',
    text: 'Turn strong reviews into ready-to-run creative in minutes and test which quotes actually land.',
  },
  {
    icon: Share2,
    title: 'Social sharing',
    text: 'Publish standout reviews straight to your social channels without designing anything from scratch.',
  },
  {
    icon: Mail,
    title: 'Email-ready blocks',
    text: 'Add your score to newsletters, receipts, and signatures so every message carries proof.',
  },
  {
    icon: Search,
    title: 'Stronger search presence',
    text: 'Fresh, verified review content gives search engines and AI assistants more reason to surface you.',
  },
]

export default function AccelerateConversionsPage() {
  return (
    <>
      <PageHero
        kicker="By business goal"
        title="Accelerate conversions with social proof"
        description="Let your customers do the selling. Real ratings and real quotes reassure buyers at every point where they might otherwise hesitate."
        primary={{ to: '/pricing', label: 'Explore all plans' }}
        secondary={{ to: '/setup', label: 'Get started free' }}
        visual={
          <ImageVisual
            src="/Accelerate-conversions-hero.png"
            alt="Shopper checking star ratings and reviews before checkout"
          />
        }
      />

      <StatBand stats={stats} />

      <FeatureRow
        kicker="Close the sale"
        title="Reassure buyers at the moment they decide"
        description="Hesitation usually happens on the product page and at checkout. Putting genuine customer feedback exactly there answers the doubt without you having to make another claim about yourself."
        bullets={[
          'Show your score and recent reviews on the pages where buyers stall.',
          'Highlight reviews that mention the concern a category of buyer tends to have.',
          'Keep it current automatically, so the proof never goes stale.',
        ]}
        visual={
          <ImageVisual
            src="/Accelerate-checkout-proof.png"
            alt="Product page with trust score and reviews near the buy button"
          />
        }
      />

      <FeatureRow
        kicker="Reach new audiences"
        title="Carry proof into every channel you pay for"
        description="A rating earns attention in places a marketing message cannot. Put it in your ads, your emails, and your listings and the same budget starts working harder."
        bullets={[
          'Add star ratings to paid campaigns to lift click-through on the spend you already have.',
          'Feed fresh review content to search engines and AI answer engines.',
          'Reuse your best quotes across print, packaging, and video.',
        ]}
        visual={
          <ImageVisual
            src="/Accelerate-ads-proof.png"
            alt="Marketer reviewing ad creatives that include customer ratings"
          />
        }
        reverse
        tone="muted"
      />

      <CapabilityGrid
        title="Put your social proof to work"
        description="A set of tools for showing what customers say about you, wherever people are deciding whether to buy."
        items={capabilities}
      />

      <CustomerStory
        company="Clearpath Finance — debt relief services"
        summary="Clearpath Finance raised conversions on its application page by double digits after adding review widgets above the form."
        body="Operating in a category crowded with inflated promises, Clearpath focused on being verifiably credible instead of loud. Moving budget towards verified reviews improved both the quality of its search traffic and the share of visitors who completed an application."
        metric={{ value: '14%', label: 'higher completion rate on the application page' }}
        image="/Accelerate-customer-story.png"
        imageAlt="Finance professional reviewing an application with trust ratings nearby"
      />

      <CrossLinks
        title="Showing social proof is one of several ways to build trust and grow"
        links={[
          {
            to: '/solutions/engage-with-feedback',
            title: 'Engage with customer feedback',
            text: 'Reply to reviews and show buyers you are listening, whether the feedback is glowing or difficult.',
            action: 'Engage with feedback',
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
