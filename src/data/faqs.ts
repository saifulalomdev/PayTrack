export const faqs = [
    {
        question: "How does TrackFlow impact my site's performance?",
        answer: "Minimal impact. Our tracking script is under 2KB—significantly lighter than Google Analytics. It is precision-engineered to load asynchronously from the edge, ensuring your site's Lighthouse scores and Core Web Vitals remain completely uncompromised."
    },
    {
        question: "Is TrackFlow GDPR and CCPA compliant?",
        answer: "Yes. TrackFlow prioritizes privacy by design. It does not utilize third-party tracking cookies or store persistent personal profiles. Instead, tracking is completely anonymous by default, ensuring your data collection aligns seamlessly with global privacy regulations without requiring annoying cookie banners."
    },
    {
        question: "How can I deploy and host TrackFlow?",
        answer: "TrackFlow is fully open-source and built specifically for the Cloudflare ecosystem. You can deploy it completely free on your own infrastructure using Astro API routes and a Cloudflare D1 distributed SQLite database, giving you 100% ownership and control over your analytics data."
    },
    {
        question: "Are there any data caps or event volume limits?",
        answer: "No. Since you are self-hosting your own instance of TrackFlow, there are no artificial limits or paywalls on event tracking volumes. Your capacity scales directly with your underlying Cloudflare D1 and database storage limits, with zero per-event fees."
    },
    {
        question: "Can I customize the platform or integrate custom tracking logic?",
        answer: "Absolutely. TrackFlow is developer-first, schema-driven, and modular. Because the codebase is entirely open-source, you can easily modify the Drizzle ORM schema, extend the ingestion backend, or hook the underlying API routes into any custom CMS or unique technology stack."
    }
];