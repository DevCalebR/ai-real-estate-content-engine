import type { ContentPresetKey, GenerationInput } from "@/lib/types/content";

export type ContentPresetDefinition = {
  key: ContentPresetKey;
  label: string;
  shortLabel: string;
  description: string;
  promptGuidance: string;
  imageStyle: string;
  anglePool: readonly string[];
  themePool: readonly string[];
  hashtagSeeds: readonly string[];
  toneSuggestions: readonly string[];
  goalSuggestions: readonly string[];
  themeSuggestions: readonly string[];
  sample: GenerationInput;
};

export const contentPresets: Record<ContentPresetKey, ContentPresetDefinition> = {
  "real-estate": {
    key: "real-estate",
    label: "Real Estate",
    shortLabel: "Real Estate",
    description:
      "Monthly content plans for agents, teams, developers, and brokerages that need local trust, listings context, and clear buyer or seller calls to action.",
    promptGuidance:
      "Keep the content grounded in local expertise, market education, proof of trust, and timely next steps. Use any location or property details from extra context naturally.",
    imageStyle:
      "editorial property photography, refined interiors, polished neighborhood lifestyle cues, premium but approachable real estate brand direction",
    anglePool: [
      "Translate the category into clear next steps instead of generic inspiration.",
      "Turn expertise into calm, actionable guidance that builds trust quickly.",
      "Use proof, process, and specificity to reduce hesitation.",
      "Show how better planning creates better timing and better outcomes.",
      "Anchor the message in credibility, clarity, and momentum toward the next conversation.",
    ],
    themePool: [
      "Market shift insight",
      "Client win",
      "Neighborhood spotlight",
      "Listing story",
      "Buyer myth reset",
      "Seller strategy",
      "Relocation guide",
      "Lifestyle angle",
      "Pricing perspective",
      "Preparation checklist",
    ],
    hashtagSeeds: ["RealEstateMarketing", "LocalMarket", "HomeBuyingTips"],
    toneSuggestions: [
      "Calm, premium, and locally trusted",
      "Luxury editorial with concierge energy",
      "Clear educator with grounded market confidence",
    ],
    goalSuggestions: [
      "Grow qualified consultation calls",
      "Build trust with buyers and sellers before the first conversation",
      "Turn local expertise into repeatable social proof",
    ],
    themeSuggestions: [
      "Local market shifts",
      "Neighborhood lifestyle",
      "Buyer and seller FAQs",
      "Proof of process",
    ],
    sample: {
      preset: "real-estate",
      businessName: "Avery Nolan Properties",
      niche: "Luxury coastal real estate and relocation support",
      targetAudience:
        "Affluent buyers relocating to Charleston who want a polished local advisor with strong negotiation instincts",
      offer: "Relocation strategy, home search guidance, and luxury listing representation",
      goals:
        "Increase consultation requests, build trust before the first call, and turn market expertise into consistent inbound interest",
      tone: "Luxury editorial with calm concierge confidence",
      primaryCta: "Book a relocation strategy call",
      keyThemes:
        "Market clarity, relocation planning, neighborhood fit, luxury property positioning, client wins",
      extraContext:
        "Primary market is Charleston, SC. Relevant details include waterfront homes, walkable historic neighborhoods, turnkey interiors, and private outdoor space.",
      platforms: ["Instagram", "LinkedIn", "Facebook"],
    },
  },
  "coach-consultant": {
    key: "coach-consultant",
    label: "Coach / Consultant",
    shortLabel: "Coach",
    description:
      "For consultants, coaches, strategists, and personal brands that need authority-led content, trust-building education, and conversion-focused calls to action.",
    promptGuidance:
      "Lead with clarity, insight, and decision-making confidence. Make the content feel advisory and useful, not motivational filler.",
    imageStyle:
      "expert-led editorial portraits, workshop moments, premium presentation slides, thoughtful desk setups, modern service-brand polish",
    anglePool: [
      "Turn expertise into a repeatable teaching moment with a concrete takeaway.",
      "Use point-of-view and proof to make the offer feel credible and differentiated.",
      "Address hesitation directly and replace it with a clearer buying decision.",
      "Teach just enough to build trust while protecting the premium value of the offer.",
      "Keep the message sharp, useful, and naturally conversion-oriented.",
    ],
    themePool: [
      "Framework breakdown",
      "Client transformation",
      "Common bottleneck",
      "Myth reset",
      "Authority story",
      "FAQ answer",
      "Offer walkthrough",
      "Mindset shift",
      "Decision filter",
      "Behind-the-scenes process",
    ],
    hashtagSeeds: ["ConsultantMarketing", "ThoughtLeadership", "ExpertBrand"],
    toneSuggestions: [
      "Warm authority with sharp clarity",
      "Direct, strategic, and high-trust",
      "Smart educator with premium service positioning",
    ],
    goalSuggestions: [
      "Attract higher-intent leads",
      "Clarify the offer and reduce hesitation",
      "Build authority on social without sounding generic",
    ],
    themeSuggestions: [
      "Frameworks and playbooks",
      "Client objections",
      "Offer education",
      "Transformation stories",
    ],
    sample: {
      preset: "coach-consultant",
      businessName: "Northline Advisory",
      niche: "Revenue strategy consulting for founder-led service firms",
      targetAudience:
        "Founders doing 500k to 3M in annual revenue who need stronger positioning and a more repeatable sales motion",
      offer: "Fractional growth strategy and sales-system advisory",
      goals:
        "Generate discovery calls, strengthen authority on LinkedIn, and turn strategic insight into trust-building content",
      tone: "Direct, strategic, and reassuring",
      primaryCta: "Book a growth audit",
      keyThemes:
        "Positioning clarity, offer packaging, sales process gaps, founder bottlenecks, high-leverage growth moves",
      extraContext:
        "Primary channels are LinkedIn and Instagram. The offer is premium and consultative, so content should feel thoughtful instead of loud.",
      platforms: ["LinkedIn", "Instagram", "X / Twitter"],
    },
  },
  "saas-productized-service": {
    key: "saas-productized-service",
    label: "SaaS / Productized Service",
    shortLabel: "SaaS / Service",
    description:
      "Built for SaaS products, automation tools, agencies, productized services, and startups that need social content aimed at traffic, awareness, signups, and offer conversion.",
    promptGuidance:
      "Emphasize product value, use cases, proof, objections, workflows, and reasons to visit the website or try the offer. Make the content traffic-oriented and strong for LinkedIn, X, TikTok, Instagram, and Facebook.",
    imageStyle:
      "modern SaaS marketing visuals, dashboard closeups, crisp UI mockups, product screenshots, workflow diagrams, premium software-brand atmosphere",
    anglePool: [
      "Lead with the problem the audience already feels, then connect it to a clear product or service outcome.",
      "Make the offer concrete with use cases, workflows, proof, and a strong traffic-driving next step.",
      "Use social content to bridge curiosity into site visits, demos, signups, or lead captures.",
      "Show the before-and-after of better systems, better tooling, or better execution.",
      "Keep the tone smart, commercial, and product-led without sounding like ad copy pasted into social.",
    ],
    themePool: [
      "Pain point breakdown",
      "Use case spotlight",
      "Product walkthrough",
      "Traffic driver",
      "Customer outcome",
      "Feature with context",
      "Workflow demo",
      "Objection answer",
      "Launch angle",
      "Website CTA story",
    ],
    hashtagSeeds: ["SaaSMarketing", "ProductizedService", "GrowthSystems"],
    toneSuggestions: [
      "Smart operator energy with commercial clarity",
      "Product-led, strategic, and confident",
      "Modern growth brand with sharp useful copy",
    ],
    goalSuggestions: [
      "Drive qualified traffic to the website",
      "Increase demo requests or signups",
      "Turn product benefits into concrete social proof and action",
    ],
    themeSuggestions: [
      "Use cases and workflows",
      "Customer outcomes",
      "Feature education with context",
      "Traffic-driving hooks",
    ],
    sample: {
      preset: "saas-productized-service",
      businessName: "RelayWorks Studio",
      niche: "AI automation systems and productized implementation support",
      targetAudience:
        "Lean teams, founders, and operators who want more leverage from automation without hiring a large internal systems team",
      offer: "Automation design, implementation sprints, and ongoing system optimization",
      goals:
        "Drive traffic to the website, generate discovery calls, and turn social content into proof of capability for productized services and SaaS offers",
      tone: "Sharp, modern, and commercially useful",
      primaryCta: "Visit the site to book a systems call",
      keyThemes:
        "Automation workflows, before-and-after efficiency gains, service proof, product walkthroughs, traffic-driving hooks",
      extraContext:
        "This preset should work well later for RelayWorks-style products and services. Prioritize content that can move someone from social into a website visit or demo request.",
      platforms: ["LinkedIn", "Instagram", "X / Twitter", "TikTok"],
    },
  },
  "e-commerce": {
    key: "e-commerce",
    label: "E-commerce",
    shortLabel: "E-commerce",
    description:
      "For product brands that need social content around launches, product education, demand generation, customer proof, and purchase intent.",
    promptGuidance:
      "Balance product desire, education, proof, and conversion. Keep the content tuned to social platforms and avoid generic lifestyle captions.",
    imageStyle:
      "premium product photography, textured backdrops, packaging closeups, UGC-inspired product moments, polished commerce visuals",
    anglePool: [
      "Show why the product matters in the customer’s real life, not only what it is.",
      "Use specific product benefits, proof, and moments of use to raise purchase intent.",
      "Make launches and offers feel timely without losing brand quality.",
      "Use objections and comparisons to sharpen the buying decision.",
      "Keep the message visual, tactile, and conversion-aware.",
    ],
    themePool: [
      "Hero product spotlight",
      "How-to use case",
      "Customer proof",
      "Launch moment",
      "Comparison angle",
      "Routine integration",
      "Problem solved",
      "Behind-the-brand story",
      "Offer reminder",
      "FAQ response",
    ],
    hashtagSeeds: ["EcommerceMarketing", "ShopLaunch", "ProductStory"],
    toneSuggestions: [
      "Polished, vibrant, and benefit-led",
      "Modern brand storytelling with clear conversion intent",
      "Warm, tactile, and product-focused",
    ],
    goalSuggestions: [
      "Increase product page traffic",
      "Support launches and promotions with stronger storytelling",
      "Create more demand with clearer product education",
    ],
    themeSuggestions: [
      "Product benefits",
      "Proof and reviews",
      "Launches and drops",
      "How customers use the product",
    ],
    sample: {
      preset: "e-commerce",
      businessName: "Harbor & Pine",
      niche: "Premium home fragrance and candle brand",
      targetAudience:
        "Design-conscious shoppers who want elevated home rituals and giftable products that feel intentional",
      offer: "Seasonal candle collections and home scent bundles",
      goals:
        "Increase product page traffic, support collection launches, and turn social into stronger repeat-purchase demand",
      tone: "Clean, elevated, and sensory",
      primaryCta: "Shop the latest collection",
      keyThemes:
        "Product rituals, scent storytelling, seasonal drops, customer proof, gifting moments",
      extraContext:
        "Brand visuals should feel premium and tactile. Seasonal launches and bundle promotions matter.",
      platforms: ["Instagram", "TikTok", "Facebook"],
    },
  },
  "local-business": {
    key: "local-business",
    label: "Local Business",
    shortLabel: "Local",
    description:
      "For local service brands and brick-and-mortar businesses that need trust, visibility, repeat visits, and clearer reasons to book or stop by.",
    promptGuidance:
      "Use local relevance, proof, service quality, and practical reasons to visit or book. Make the content feel grounded in the business experience.",
    imageStyle:
      "warm storefront imagery, in-location moments, staff and service interactions, lifestyle-led local brand visuals",
    anglePool: [
      "Show the quality of the experience, not only the offer itself.",
      "Make the local value obvious with specific reasons to visit, book, or refer.",
      "Use reviews, routines, and behind-the-scenes proof to build trust.",
      "Tie promotions and recurring services to real customer needs.",
      "Keep the content neighborhood-aware and action-oriented.",
    ],
    themePool: [
      "Service spotlight",
      "Customer story",
      "Behind the counter",
      "Offer reminder",
      "Seasonal moment",
      "FAQ answer",
      "Team introduction",
      "Why locals choose us",
      "Neighborhood tie-in",
      "Visit trigger",
    ],
    hashtagSeeds: ["LocalBusinessMarketing", "ShopLocal", "CommunityBrand"],
    toneSuggestions: [
      "Friendly, confident, and community-rooted",
      "Local expert with warm clarity",
      "Inviting and polished",
    ],
    goalSuggestions: [
      "Increase bookings or foot traffic",
      "Build stronger local familiarity and trust",
      "Create repeatable content for promotions and community awareness",
    ],
    themeSuggestions: [
      "What makes the experience different",
      "Local proof and reviews",
      "Seasonal or timely offers",
      "Team and service stories",
    ],
    sample: {
      preset: "local-business",
      businessName: "Elm Street Wellness",
      niche: "Boutique wellness studio and recovery services",
      targetAudience:
        "Busy professionals and active adults who want premium local wellness support with a calm, trustworthy brand",
      offer: "Membership-based recovery sessions, infrared sauna, and mobility support",
      goals:
        "Increase studio visits, strengthen local awareness, and make recurring services easier to understand and book",
      tone: "Warm, grounded, and premium",
      primaryCta: "Book your first session",
      keyThemes:
        "Service experience, customer wins, wellness education, community relevance, offer clarity",
      extraContext:
        "Business is location-based and thrives on repeat visits, referrals, and stronger understanding of service benefits.",
      platforms: ["Instagram", "Facebook", "TikTok"],
    },
  },
  "creator-brand": {
    key: "creator-brand",
    label: "Creator Brand",
    shortLabel: "Creator",
    description:
      "For creators, media brands, and online personalities that need structured monthly content around audience growth, authority, offers, and traffic.",
    promptGuidance:
      "Blend personal point of view, audience education, behind-the-scenes narrative, and offer-aware promotion. Keep it specific and social-native.",
    imageStyle:
      "creator-led editorial frames, studio shots, personal brand lifestyle moments, clean content overlays, premium social visuals",
    anglePool: [
      "Lead with point of view and make the lesson specific enough to be memorable.",
      "Balance audience growth content with offer-aware promotion and proof.",
      "Use story and process to make the brand feel human and credible.",
      "Turn recurring audience questions into reusable content assets.",
      "Keep the message fast, social-native, and strategically useful.",
    ],
    themePool: [
      "Point-of-view post",
      "Behind-the-scenes story",
      "Audience FAQ",
      "Process breakdown",
      "Offer mention",
      "Lesson learned",
      "Content repurpose angle",
      "Growth observation",
      "Belief statement",
      "Collaboration prompt",
    ],
    hashtagSeeds: ["CreatorMarketing", "PersonalBrand", "AudienceGrowth"],
    toneSuggestions: [
      "Distinctive, sharp, and conversational",
      "Smart personal brand with clear perspective",
      "Human, strategic, and memorable",
    ],
    goalSuggestions: [
      "Grow audience quality and engagement",
      "Promote products or offers without sounding forced",
      "Create reusable brand pillars for a monthly cadence",
    ],
    themeSuggestions: [
      "Point of view",
      "Behind the scenes",
      "Offer promotion with context",
      "Audience questions",
    ],
    sample: {
      preset: "creator-brand",
      businessName: "Nia Rowe",
      niche: "Creator brand focused on creative systems and sustainable online growth",
      targetAudience:
        "Solo creators and online educators who want better content systems without losing originality",
      offer: "Workshops, templates, and audience-growth education",
      goals:
        "Grow engaged followers, increase workshop sales, and turn social content into stronger trust and repeat audience touchpoints",
      tone: "Distinctive, thoughtful, and direct",
      primaryCta: "Join the next workshop",
      keyThemes:
        "Creative systems, audience growth, process transparency, point of view, product education",
      extraContext:
        "The brand should feel personal, smart, and useful rather than highly corporate.",
      platforms: ["Instagram", "LinkedIn", "X / Twitter", "TikTok"],
    },
  },
};

export function getContentPreset(key: ContentPresetKey) {
  return contentPresets[key];
}

export const presetCards = Object.values(contentPresets).map((preset) => ({
  key: preset.key,
  label: preset.label,
  shortLabel: preset.shortLabel,
  description: preset.description,
}));
