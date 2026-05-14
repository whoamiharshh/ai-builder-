-- SyntheticAI Database Schema

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  avatar_url TEXT,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  credits INT DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  niche VARCHAR(255),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Generations table
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Market Analysis
  niche VARCHAR(255),
  demand_score INT,
  buyer_intent INT,
  competition INT,
  urgency INT,
  profitability INT,
  trend_growth INT,
  
  -- Product Details
  product_type VARCHAR(100),
  title VARCHAR(255),
  subtitle VARCHAR(255),
  tagline TEXT,
  content JSONB,
  outline TEXT[],
  sales_copy TEXT,
  
  -- Branding
  brand_name VARCHAR(255),
  brand_palette VARCHAR(7)[],
  brand_typography VARCHAR(100),
  brand_direction TEXT,
  
  -- Emotional Positioning
  emotional_hooks TEXT[],
  target_audience JSONB,
  psychological_triggers TEXT[],
  
  -- Assets
  primary_image_url TEXT,
  mockup_urls TEXT[],
  asset_bundle_url TEXT,
  
  -- Metadata
  generation_time INT,
  ai_model VARCHAR(100),
  status VARCHAR(50) DEFAULT 'complete',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exports table
CREATE TABLE exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID NOT NULL REFERENCES ai_generations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  format VARCHAR(50),
  file_url TEXT,
  file_size INT,
  download_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  generation_id UUID REFERENCES ai_generations(id) ON DELETE SET NULL,
  
  -- Engagement
  view_count INT DEFAULT 0,
  share_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  export_count INT DEFAULT 0,
  
  -- Conversion
  estimated_conversion_rate DECIMAL(5, 2),
  estimated_revenue INT,
  niche_viability_score INT,
  
  event_type VARCHAR(100),
  event_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Saved Templates table
CREATE TABLE saved_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  generation_id UUID NOT NULL REFERENCES ai_generations(id) ON DELETE CASCADE,
  template_name VARCHAR(255),
  template_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Billing table
CREATE TABLE billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_tier VARCHAR(50),
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  billing_cycle_start TIMESTAMP,
  billing_cycle_end TIMESTAMP,
  credits_used INT DEFAULT 0,
  amount_paid DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API Keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  key_hash VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  last_used TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Templates table (Premium Feature)
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  generation_data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Variations table (Premium Feature)
CREATE TABLE variations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID NOT NULL REFERENCES ai_generations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  variation_type VARCHAR(100),
  variation_data JSONB NOT NULL,
  test_status VARCHAR(50) DEFAULT 'pending',
  metrics JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bulk Jobs table (Premium Feature)
CREATE TABLE bulk_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  input_csv TEXT,
  total_items INT,
  completed_items INT DEFAULT 0,
  results JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- User Settings table (Premium Feature)
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  export_defaults JSONB DEFAULT '{"format": "pdf", "includeAssets": true}',
  notification_preferences JSONB DEFAULT '{"emailUpdates": true, "generationComplete": true}',
  theme VARCHAR(50) DEFAULT 'light',
  api_tier VARCHAR(50) DEFAULT 'free',
  max_concurrent_jobs INT DEFAULT 5,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Metrics table (Optional)
CREATE TABLE admin_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  total_users INT,
  active_users INT,
  total_generations INT,
  total_exports INT,
  revenue DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_generations_user_id ON ai_generations(user_id);
CREATE INDEX idx_generations_project_id ON ai_generations(project_id);
CREATE INDEX idx_exports_user_id ON exports(user_id);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_billing_user_id ON billing(user_id);
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_category ON templates(category);
CREATE INDEX idx_variations_generation_id ON variations(generation_id);
CREATE INDEX idx_variations_user_id ON variations(user_id);
CREATE INDEX idx_bulk_jobs_user_id ON bulk_jobs(user_id);
CREATE INDEX idx_bulk_jobs_status ON bulk_jobs(status);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
