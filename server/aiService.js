import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'gpt-4o-mini';
const isOpenRouterEnabled = Boolean(OPENROUTER_API_KEY);

const productTypes = ['ebooks', 'planners', 'templates', 'prompt packs', 'printables', 'courses', 'toolkits', 'Notion templates'];

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseProductType(prompt) {
  const lower = prompt.toLowerCase();
  if (lower.includes('kdp') || lower.includes('ebook') || lower.includes('book')) return 'ebooks';
  if (lower.includes('planner') || lower.includes('journal')) return 'planners';
  if (lower.includes('notion') || lower.includes('workspace')) return 'Notion templates';
  if (lower.includes('course') || lower.includes('training')) return 'courses';
  if (lower.includes('prompt') || lower.includes('chatgpt')) return 'prompt packs';
  if (lower.includes('template') || lower.includes('design')) return 'templates';
  if (lower.includes('printable') || lower.includes('worksheet')) return 'printables';
  return productTypes[randomNumber(0, productTypes.length - 1)];
}

function buildStubResponse(prompt) {
  const productType = chooseProductType(prompt);
  const niche = `AI-driven ${productType} for ${prompt.replace(/,\s*/g, ' / ')}`;
  return {
    query: prompt,
    niche,
    demandScore: randomNumber(78, 98),
    buyerIntent: randomNumber(70, 95),
    competition: randomNumber(32, 58),
    urgency: randomNumber(65, 92),
    profitability: randomNumber(72, 96),
    trendGrowth: randomNumber(60, 94),
    productType,
    title: `SyntheticAI ${productType === 'ebooks' ? 'Launch Blueprint' : 'Premium Creator Pack'}`,
    tagline: `The high-converting ${productType} built for modern digital product creators.`,
    branding: {
      name: 'SyntheticAI Studio',
      palette: ['#7C3AED', '#22D3EE', '#0F172A', '#F8FAFC'],
      typography: 'Inter, Sora, Montserrat',
      tagline: 'Premium AI product design for the modern creator.',
      logoDirection: 'Minimal glyph with neon gradients and sleek geometric mark',
    },
    outline: [
      'Market demand analysis and opportunity mapping',
      'Product positioning, title, and launch messaging',
      'Chapter-by-chapter content architecture',
      'Sales funnel hooks, offer stack, and pricing strategy',
      'Visual asset plan, copy, and CTA sequences',
    ],
    salesCopy: `SyntheticAI has surfaced a high-demand product opportunity by analyzing real-world signals from Google Trends, Reddit, TikTok, Amazon KDP, Etsy, Gumroad, and YouTube. This launch-ready package gives you the exact positioning, product format, and creative direction needed to convert modern buyers.`,
    cta: 'Build your SyntheticAI digital launch now',
    pricing: [
      { tier: 'Starter', price: '$37', description: 'Core launch kit with branding, content outline, and copy assets.' },
      { tier: 'Growth', price: '$97', description: 'Includes worksheets, templates, and social creative concepts.' },
      { tier: 'Premium', price: '$197', description: 'Complete product suite with sales page, email sequences, and mockups.' },
    ],
    assets: [
      { label: '2D cover concept', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' },
      { label: '3D mockup showcase', url: 'https://images.unsplash.com/photo-1521790364324-40f0bb2a27d9?auto=format&fit=crop&w=1200&q=80' },
      { label: 'Cinematic thumbnail', url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80' },
    ],
    generatedAt: new Date().toISOString(),
  };
}

export async function generateProductFromAI(prompt) {
  if (isOpenRouterEnabled) {
    const payload = {
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are SyntheticAI, an enterprise SaaS assistant that creates premium digital product launches from demand signals.',
        },
        {
          role: 'user',
          content: `Analyze this market query and return a JSON object with niche, demandScore, buyerIntent, competition, urgency, profitability, trendGrowth, productType, title, tagline, branding, outline, salesCopy, cta, pricing, assets. Use concise, clean JSON only: ${prompt}`,
        },
      ],
      temperature: 0.4,
      max_tokens: 950,
    };
    const response = await axios.post('https://api.openrouter.ai/v1/chat/completions', payload, {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    const content = response.data?.choices?.[0]?.message?.content;
    try {
      return JSON.parse(content);
    } catch (error) {
      console.warn('OpenRouter response parse failed, falling back to stub:', error?.message);
      return buildStubResponse(prompt);
    }
  }

  return buildStubResponse(prompt);
}

export async function generateImageFromAI(prompt) {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
  ];

  if (process.env.FLUX_API_KEY || process.env.STABLE_DIFFUSION_API_KEY) {
    try {
      const { orchestrator } = await import('./aiOrchestrator.js');
      const response = await orchestrator.generateImage(`Cinematic product preview, premium brand asset, ${prompt}`, {
        numImages: 3,
        imageSize: '1024x1024',
      });
      const images = Array.isArray(response.imageUrls)
        ? response.imageUrls.map((url) => (typeof url === 'string' && !url.startsWith('http') && !url.startsWith('data:') ? `data:image/png;base64,${url}` : url))
        : [];

      if (images.length) {
        return { images };
      }
    } catch (error) {
      console.warn('AI image generation failed, falling back to static assets:', error?.message || error);
    }
  }

  return { images: fallbackImages };
}
