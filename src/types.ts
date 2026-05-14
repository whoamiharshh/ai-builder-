export type Branding = {
  name: string;
  palette: string[];
  typography: string;
  tagline: string;
  logoDirection: string;
};

export type PricingTier = {
  tier: string;
  price: string;
  description: string;
};

export type AssetItem = {
  label: string;
  url: string;
};

export type SyntheticResponse = {
  query: string;
  niche: string;
  demandScore: number;
  buyerIntent: number;
  competition: number;
  urgency: number;
  profitability: number;
  trendGrowth: number;
  productType: string;
  title: string;
  tagline: string;
  branding: Branding;
  outline: string[];
  salesCopy: string;
  cta: string;
  pricing: PricingTier[];
  assets: AssetItem[];
  generatedAt: string;
};
