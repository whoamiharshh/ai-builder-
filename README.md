# SyntheticAI

A futuristic AI SaaS prototype for automatically discovering profitable digital product niches and generating premium digital product launches.

## Features
- AI niche intelligence from Google Trends, Reddit pain points, TikTok trends, Etsy products, Gumroad bundles, YouTube searches, and Amazon KDP insights
- Demand scoring system for search volume, buyer intent, competition, emotional urgency, profitability, and trend growth
- Product decision engine for ebooks, planners, templates, prompt packs, printables, courses, toolkits, and Notion templates
- Product generation system for titles, branding, chapters, worksheets, content, descriptions, pricing, sales copy, and CTAs
- Image generation system for realistic 2D covers, ultra-realistic 3D mockups, cinematic thumbnails, social creatives, and product showcases
- Branding system with brand name generation, color palette selection, typography guidance, logo direction, and visual identity suggestions
- Landing page builder with modern sales pages, emotional hooks, testimonials, pricing tables, CTA sections, and optimized layouts
- Project dashboard with saved niches, analytics, generation history, export history, and workflow management
- Export support for PDF, ZIP, PNG, and DOCX

## Tech Stack
- React + Vite
- TailwindCSS
- Framer Motion
- Node.js + Express
- Supabase/Firebase ready architecture
- Gemini/OpenRouter and Stable Diffusion integration-ready

## Setup
1. Open `c:\Users\Sir\Desktop\website`
2. Run `npm install`
3. Copy `server/.env.example` to `server/.env` and add your `OPENROUTER_API_KEY`
4. Start the frontend with `npm run dev`
5. Start the API stub with `npm run server`

## Notes
This scaffold includes a premium UI and backend AI service stub. To make it production-ready, connect the backend to real AI services, demand sources, image generation APIs, and export rendering.
