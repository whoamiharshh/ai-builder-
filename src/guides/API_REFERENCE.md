# SyntheticAI API Reference

## Base URL

```
Development: http://localhost:4000
Production: https://api.syntheticai.com
```

## Authentication

All requests should include the API key in the header:

```
Authorization: Bearer YOUR_API_KEY
```

---

## Endpoints

### Health Check

**GET** `/api/health`

Check if the API server is running.

**Response:**
```json
{
  "status": "ok",
  "service": "SyntheticAI API",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### Generate Product

**POST** `/api/generate`

Generate a complete AI-powered digital product with niche analysis, branding, and mockups.

**Request:**
```json
{
  "prompt": "AI productivity tools for busy professionals",
  "style": "professional",
  "targetAudience": "entrepreneurs",
  "includeImages": true,
  "format": "full"
}
```

**Parameters:**
- `prompt` (string, required): Market opportunity or topic description
- `style` (string, optional): "professional" | "casual" | "luxury" (default: "professional")
- `targetAudience` (string, optional): Target demographic
- `includeImages` (boolean, optional): Generate mockups/visuals (default: true)
- `format` (string, optional): "quick" | "full" (default: "full")

**Response:**
```json
{
  "id": "gen_12345",
  "query": "AI productivity tools",
  "niche": {
    "name": "AI-Powered Productivity Suite",
    "description": "Tools for busy professionals to automate daily tasks",
    "market": "B2B SaaS"
  },
  "demandScore": {
    "buyerIntent": 92,
    "competition": 45,
    "urgency": 88,
    "profitability": 91,
    "trendGrowth": 87,
    "emotionalAppeal": 85,
    "marketTiming": 90,
    "searchVolume": 34000
  },
  "productType": "SaaS Tool / eBook Bundle",
  "title": "ProductFlow: AI Productivity System",
  "tagline": "Transform chaos into clarity. Automate your work, reclaim your time.",
  "branding": {
    "brandName": "ProductFlow",
    "colorPalette": {
      "primary": "#7C3AED",
      "secondary": "#22D3EE",
      "accent": "#8B5CF6"
    },
    "typography": {
      "primary": "Inter",
      "secondary": "Inter"
    },
    "logoDirection": "Modern, minimalist, tech-forward aesthetics"
  },
  "outline": [
    "Module 1: Understanding AI Productivity",
    "Module 2: Workflow Automation Basics",
    "Module 3: Advanced Integration Techniques"
  ],
  "salesCopy": {
    "headline": "Stop Wasting 10+ Hours Weekly on Manual Tasks",
    "subheadline": "The complete AI productivity system for professionals...",
    "benefits": ["Save 15+ hours weekly", "Reduce errors by 95%", "Scale without hiring"],
    "cta": "Start Your Productivity Revolution"
  },
  "emotionalHooks": [
    "Freedom from tedious tasks",
    "Control and clarity",
    "Professional excellence"
  ],
  "psychologicalTriggers": [
    "Scarcity of time",
    "Fear of inefficiency",
    "Desire for achievement"
  ],
  "assets": [
    {
      "type": "product_cover",
      "url": "https://cdn.syntheticai.com/assets/cover_12345.jpg"
    },
    {
      "type": "mockup_laptop",
      "url": "https://cdn.syntheticai.com/assets/mockup_12345.jpg"
    },
    {
      "type": "branding_palette",
      "url": "https://cdn.syntheticai.com/assets/palette_12345.jpg"
    }
  ],
  "pricing": [
    {
      "tier": "Standard",
      "price": 49,
      "description": "Core AI productivity bundle"
    },
    {
      "tier": "Pro",
      "price": 99,
      "description": "Advanced automation + training"
    }
  ],
  "generatedAt": "2024-01-15T10:30:00Z",
  "status": "success"
}
```

**Error Response:**
```json
{
  "status": "error",
  "error": "API_ERROR",
  "message": "Failed to generate product",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### Analyze Niche

**POST** `/api/analyze-niche`

Analyze a specific niche for demand signals and market opportunity.

**Request:**
```json
{
  "niche": "AI productivity tools",
  "dataSource": "comprehensive"
}
```

**Response:**
```json
{
  "niche": "AI productivity tools",
  "demandScore": {
    "buyerIntent": 92,
    "competition": 45,
    "urgency": 88,
    "profitability": 91,
    "trendGrowth": 87
  },
  "marketData": {
    "googleTrendScore": 92,
    "searchVolume": 34000,
    "redditMentions": 450,
    "youtubeVideos": 1200,
    "tiktokTrend": "rising"
  },
  "competitorAnalysis": {
    "majorPlayers": 15,
    "marketGap": "Affordable AI bundling",
    "opportunity": "High"
  },
  "recommendation": "Highly recommended niche with strong market demand"
}
```

---

### Generate Images

**POST** `/api/generate-images`

Generate cinematic mockups and visuals for a product.

**Request:**
```json
{
  "productTitle": "ProductFlow",
  "assetTypes": ["cover", "mockup_laptop", "mockup_phone"],
  "style": "cinematic"
}
```

**Response:**
```json
{
  "generationId": "imggen_12345",
  "assets": [
    {
      "type": "cover",
      "url": "https://cdn.syntheticai.com/assets/cover_12345.jpg",
      "prompt": "Ultra-realistic product cover showing AI productivity tool interface"
    },
    {
      "type": "mockup_laptop",
      "url": "https://cdn.syntheticai.com/assets/mockup_12345.jpg",
      "prompt": "Cinematic laptop mockup showing ProductFlow dashboard"
    }
  ]
}
```

---

### Save Project

**POST** `/api/projects`

Save a generated product as a project.

**Request:**
```json
{
  "generationId": "gen_12345",
  "projectName": "ProductFlow MVP",
  "description": "AI productivity tool for busy professionals"
}
```

**Response:**
```json
{
  "projectId": "proj_12345",
  "generationId": "gen_12345",
  "name": "ProductFlow MVP",
  "status": "saved",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### List Projects

**GET** `/api/projects`

Get all projects for the authenticated user.

**Query Parameters:**
- `sort` (string, optional): "created" | "updated" (default: "created")
- `limit` (number, optional): Results per page (default: 20)
- `offset` (number, optional): Pagination offset (default: 0)

**Response:**
```json
{
  "projects": [
    {
      "id": "proj_12345",
      "name": "ProductFlow MVP",
      "description": "AI productivity tool",
      "niche": "AI productivity",
      "status": "complete",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 15,
  "limit": 20,
  "offset": 0
}
```

---

### Export Project

**POST** `/api/projects/{projectId}/export`

Export a project in the specified format.

**Request:**
```json
{
  "format": "pdf",
  "includeAssets": true,
  "includeAnalytics": false
}
```

**Parameters:**
- `format` (string, required): "pdf" | "png" | "docx" | "zip" | "html"
- `includeAssets` (boolean, optional): Include all generated assets
- `includeAnalytics` (boolean, optional): Include analytics data

**Response:**
```json
{
  "exportId": "exp_12345",
  "format": "pdf",
  "fileName": "ProductFlow_MVP.pdf",
  "fileUrl": "https://cdn.syntheticai.com/exports/ProductFlow_MVP.pdf",
  "fileSize": 2457600,
  "expiresAt": "2024-01-22T10:30:00Z"
}
```

---

### Get Analytics

**GET** `/api/projects/{projectId}/analytics`

Get analytics for a project.

**Response:**
```json
{
  "projectId": "proj_12345",
  "analytics": {
    "views": 145,
    "downloads": 23,
    "exports": 8,
    "favorited": 5,
    "estimatedConversionRate": 0.12,
    "estimatedRevenue": 1240,
    "nichViabilityScore": 0.92
  },
  "timeline": [
    {
      "date": "2024-01-15",
      "views": 45,
      "downloads": 8
    }
  ]
}
```

---

### Save Template

**POST** `/api/templates`

Save a generation as a reusable template.

**Request:**
```json
{
  "generationId": "gen_12345",
  "templateName": "Productivity Tools Template",
  "category": "software"
}
```

**Response:**
```json
{
  "templateId": "tmpl_12345",
  "name": "Productivity Tools Template",
  "category": "software",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

### Get Templates

**GET** `/api/templates`

Get all saved templates.

**Response:**
```json
{
  "templates": [
    {
      "id": "tmpl_12345",
      "name": "Productivity Tools Template",
      "category": "software",
      "usageCount": 3,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 5
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | BAD_REQUEST | Invalid request parameters |
| 401 | UNAUTHORIZED | Missing or invalid authentication |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 429 | RATE_LIMITED | Too many requests |
| 500 | SERVER_ERROR | Internal server error |
| 503 | SERVICE_UNAVAILABLE | Service temporarily unavailable |

---

## Rate Limits

- **Free tier:** 10 requests/hour
- **Pro tier:** 100 requests/hour
- **Enterprise tier:** Unlimited

---

## Webhooks

Subscribe to events via webhooks:

```json
{
  "event": "generation.completed",
  "data": {
    "generationId": "gen_12345",
    "status": "success",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## SDK & Libraries

Available SDKs:
- **JavaScript/TypeScript:** `npm install syntheticai`
- **Python:** `pip install syntheticai`
- **Go:** `go get github.com/syntheticai/go-sdk`

---

## Examples

### JavaScript/Axios

```typescript
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Authorization': `Bearer ${process.env.API_KEY}`,
  },
});

async function generateProduct(prompt) {
  const response = await client.post('/api/generate', { prompt });
  return response.data;
}
```

### cURL

```bash
curl -X POST http://localhost:4000/api/generate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "AI productivity tools"
  }'
```

---

## Support

For API support:
- Email: api-support@syntheticai.com
- Documentation: https://docs.syntheticai.com
- Status: https://status.syntheticai.com
