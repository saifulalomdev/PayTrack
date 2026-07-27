export interface Plan {
  id: string;
  name: string;
  price: number;
  desc: string;
  features: string[];
  discount?: string;
  highlight?: boolean;
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    desc: "Perfect for hobbyists and solo developers tracking small projects.",
    features: [
      "Up to 5,000 monthly events",
      "1 Domain integration",
      "Real-time data dashboard",
      "24-hour data retention",
      "Community support"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    highlight: true,
    desc: "Advanced tracking for growing startups and professional creators.",
    discount: "Save 20% yearly",
    features: [
      "Everything in Free",
      "50,000 monthly events",
      "Unlimited domain aliases",
      "30-day data retention",
      "Custom conversion goals",
      "Priority email support",
      "API access for exports"
    ]
  },
  {
    id: "team",
    name: "Team",
    price: 79,
    desc: "Collaborative tools for teams that need high-frequency data.",
    discount: "Save 15% yearly",
    features: [
      "Everything in Pro",
      "500,000 monthly events",
      "Shared team workspaces",
      "Granular permission control",
      "Extended 1-year retention"
    ]
  }
];