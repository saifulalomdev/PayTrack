import type { FeaturesCardProps } from "@/modules/marketing";

export const features: FeaturesCardProps[] = [
    {
        title: "Edge-Native Speeds",
        description: "Deploy your tracking backend across a global network of 330+ data centers. Experience sub-millisecond data ingestion with near-zero latency.",
        isGradiant: true
    },
    {
        title: "Privacy by Design",
        description: "Bypass cookie banners completely. Track unique visits, session loops, and referrer drops anonymously without collecting personal tracking markers.",
        isGradiant: false
    },
    {
        title: "D1 Schema Storage",
        description: "Retain 100% data ownership. Log and store relational analytics tables safely inside your own type-safe Cloudflare D1 distributed SQLite database.",
        isGradiant: false
    },
    {
        title: "Zero-Bloat Snippet",
        description: "Keep your Core Web Vitals in the green with an asynchronous tracking script under 2KB. High-fidelity analytics data without client-side baggage.",
        isGradiant: true
    },
];