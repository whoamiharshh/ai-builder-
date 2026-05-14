# SyntheticAI Deployment & DevOps Guide

## Architecture Overview

```
┌─────────────┐
│   Frontend  │ (React + Vite)
│ Vercel/CDN  │
└──────┬──────┘
       │ HTTPS
       ↓
┌─────────────────────────────────────────────────┐
│              API Gateway / Load Balancer        │
│          (Vercel Serverless / AWS ALB)         │
└──────┬──────────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────────────┐
│  Backend Services (Node.js + Express)           │
│  • Generation API                               │
│  • Project Management                           │
│  • Analytics                                    │
│  • File Processing                              │
└──────┬──────────┬──────────┬──────────┬────────┘
       │          │          │          │
       ↓          ↓          ↓          ↓
   Supabase    S3/CDN    Redis      External
   Database   (Assets)   (Cache)     APIs
```

---

## 1. Development Environment

### Local Setup

```bash
# Clone repository
git clone https://github.com/syntheticai/platform.git
cd platform

# Install dependencies
npm install

# Setup environment
cp server/.env.example server/.env
# (Fill in API keys)

# Start dev servers
npm run dev        # Frontend on :5173
npm run server     # Backend on :4000

# Database setup (optional - use hosted Supabase)
npm run db:setup
```

### Development Database

Use Supabase hosted for consistency:
- [Supabase Dashboard](https://supabase.com/dashboard)
- Connect via connection string
- No local setup required

---

## 2. Staging Deployment

### Staging Environment Setup

```
Frontend:  https://staging-app.syntheticai.com
Backend:   https://staging-api.syntheticai.com
Database:  Supabase staging project
```

### Deploy to Vercel (Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to staging
vercel --prod --yes

# Or use GitHub integration:
# 1. Connect repo to Vercel
# 2. Set environment variables in Vercel dashboard
# 3. Commits to staging/* branch auto-deploy
```

### Deploy Backend (Node.js)

**Option A: Vercel Serverless**

```bash
# vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "functions": {
    "server/index.js": {
      "memory": 3008,
      "maxDuration": 60
    }
  }
}
```

**Option B: Railway.app (Recommended for Full Stack)**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up

# Set environment variables
railway variables set OPENROUTER_API_KEY=sk_...
railway variables set DATABASE_URL=postgresql://...
```

**Option C: AWS EC2/Lambda**

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY server ./server
COPY src/database ./src/database

EXPOSE 4000

CMD ["node", "server/index.js"]
```

Deploy:
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker build -t syntheticai-api .
docker tag syntheticai-api:latest <account>.dkr.ecr.us-east-1.amazonaws.com/syntheticai-api:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/syntheticai-api:latest

# Deploy to ECS/EKS or run on EC2
```

---

## 3. Production Deployment

### Production Environment

```
Frontend:  https://app.syntheticai.com
Backend:   https://api.syntheticai.com
Database:  Supabase production project
```

### Pre-Production Checklist

- [ ] All tests passing
- [ ] Code reviewed and merged
- [ ] Environment variables set
- [ ] Database backups scheduled
- [ ] Monitoring configured
- [ ] Error tracking (Sentry) setup
- [ ] Analytics (Mixpanel) configured
- [ ] DNS records configured
- [ ] SSL certificates installed
- [ ] CDN configured for assets

### Production Deployment Steps

```bash
# 1. Build frontend
npm run build

# 2. Run tests
npm run test

# 3. Deploy frontend to CDN/Vercel
vercel --prod

# 4. Deploy backend
railway up --production

# Or manual deployment:
# 5. SSH into production server
ssh deploy@syntheticai.com

# 6. Pull latest code
git pull origin main

# 7. Install dependencies
npm install --production

# 8. Run migrations
npm run db:migrate

# 9. Restart service
sudo systemctl restart syntheticai-api

# 10. Verify deployment
curl https://api.syntheticai.com/api/health
```

---

## 4. Database Management

### Supabase Setup

```sql
-- Create production database
-- Run in Supabase SQL editor:
-- src/database/schema.sql

-- Setup backups
-- Supabase Dashboard → Database → Backups → Enable
-- Set backup frequency: daily

-- Setup Point-in-Time Recovery (PITR)
-- Supabase Dashboard → Database → Backup Settings → PITR
```

### Database Migrations

```bash
# Create new migration
supabase migration new add_new_column

# Apply migrations
supabase db push

# Rollback last migration
supabase db rollback --step 1

# View migration status
supabase migration list
```

### Backup & Recovery

```bash
# Manual backup
pg_dump $DATABASE_URL | gzip > backup-$(date +%Y%m%d).sql.gz

# Encrypt backup
gpg --symmetric backup-$(date +%Y%m%d).sql.gz

# Upload to S3
aws s3 cp backup-$(date +%Y%m%d).sql.gz.gpg s3://syntheticai-backups/

# Schedule daily backups via cron
0 2 * * * pg_dump $DATABASE_URL | gzip | aws s3 cp - s3://syntheticai-backups/backup-$(date +\%Y\%m\%d).sql.gz
```

---

## 5. CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm run test
      
      - name: Build frontend
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel (Frontend)
        uses: BetaHuhn/deploy-to-vercel-action@v1
        with:
          GITHUB_TOKEN: ${{ github.token }}
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
      
      - name: Deploy to Railway (Backend)
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g @railway/cli
          railway up --production
```

---

## 6. Monitoring & Observability

### Error Tracking (Sentry)

```typescript
// server/index.js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### Analytics (Mixpanel)

```typescript
// src/services/analytics.ts
import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.VITE_MIXPANEL_TOKEN);

export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  mixpanel.track(eventName, {
    ...properties,
    timestamp: new Date(),
  });
}

export function trackUser(userId: string) {
  mixpanel.identify(userId);
  mixpanel.people.set({ $name: userId });
}
```

### Uptime Monitoring

```bash
# Use Ping42 or similar service
# Monitor endpoints:
GET https://api.syntheticai.com/api/health
POST https://api.syntheticai.com/api/generate (with auth)

# Alert on failure
# Slack notification to #alerts channel
# Page on-call engineer if critical
```

### Logs Aggregation (DataDog/LogRocket)

```typescript
// LogRocket for frontend
import LogRocket from 'logrocket';

LogRocket.init('app-id');

LogRocket.getSessionURL(sessionURL => {
  Sentry.captureException(error, { extra: { sessionURL } });
});
```

---

## 7. Performance Optimization

### CDN Configuration (Cloudflare)

```
Cache Rules:
- /static/* → Cache 30 days
- /api/* → No cache
- /* → Cache 1 hour

Page Rules:
- app.syntheticai.com → Cache everything
- api.syntheticai.com → No cache

Worker Scripts:
- Add security headers
- Implement rate limiting
```

### Database Performance

```sql
-- Add indexes
CREATE INDEX ON ai_generations(user_id);
CREATE INDEX ON ai_generations(created_at);
CREATE INDEX ON projects(user_id);

-- Monitor slow queries
EXPLAIN ANALYZE SELECT * FROM ai_generations WHERE user_id = 123;

-- Optimize queries
-- Use connection pooling (PgBouncer)
```

### Application Performance

```typescript
// Implement caching
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCachedProject(projectId: string) {
  const cached = await redis.get(`project:${projectId}`);
  if (cached) return JSON.parse(cached);
  
  const project = await db.getProject(projectId);
  await redis.setex(`project:${projectId}`, 3600, JSON.stringify(project));
  return project;
}
```

---

## 8. Scaling Strategy

### Horizontal Scaling

```
Current:
- 1 API server
- Supabase (managed scaling)
- Vercel (auto-scaling frontend)

Phase 1 (1000+ users):
- Load balancer (AWS ALB)
- 2-3 API instances
- Redis cache layer

Phase 2 (10000+ users):
- Auto-scaling group (2-10 instances)
- Read replicas for database
- Message queue (RabbitMQ/SQS)

Phase 3 (100000+ users):
- Kubernetes cluster
- Microservices architecture
- CDN for all assets
- Database sharding
```

### Load Balancing

```yaml
# Nginx config
upstream api_backend {
  server api1.syntheticai.com:4000;
  server api2.syntheticai.com:4000;
  server api3.syntheticai.com:4000;
}

server {
  listen 80;
  server_name api.syntheticai.com;

  location /api/ {
    proxy_pass http://api_backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

---

## 9. Disaster Recovery

### Backup Strategy

```bash
# Daily automated backups
- Database: Daily snapshots (30 day retention)
- Code: GitHub (infinite retention)
- Assets: S3 with versioning enabled
- Configs: Environment variables in AWS Secrets Manager

# Backup Schedule:
- 02:00 UTC Daily database backup
- 03:00 UTC Weekly S3 sync
- 04:00 UTC Monthly full backup to cold storage
```

### Recovery Procedures

```bash
# Database Recovery
1. Identify recovery point
2. Supabase → Database → Backups → Restore
3. Verify data integrity
4. Update database connection string
5. Test application

# Service Recovery
1. Check server status
2. Review logs (CloudWatch/DataDog)
3. Restart service: sudo systemctl restart syntheticai-api
4. Verify health check: curl https://api.syntheticai.com/api/health
5. Monitor for 15 minutes
```

### RTO/RPO Targets

- **RTO (Recovery Time Objective):** < 1 hour
- **RPO (Recovery Point Objective):** < 15 minutes

---

## 10. Security in Production

### SSL/TLS Certificates

```bash
# Use Let's Encrypt (free)
certbot certonly --dns-route53 -d syntheticai.com -d *.syntheticai.com

# Auto-renewal (certbot renewal runs daily via cron)
0 12 * * * certbot renew --quiet
```

### Environment Variables in Production

```bash
# Use AWS Secrets Manager or Vercel environment
# Never expose secrets in logs or version control

# Vercel
vercel env set OPENROUTER_API_KEY sk_...

# Railway
railway variables set OPENROUTER_API_KEY=sk_...
```

### DDoS Protection

```
Enable CloudFlare DDoS Protection:
- Mitigate Layer 7 attacks
- Rate limiting
- Firewall rules
- Worker rate limiting
```

---

## 11. Incident Response

### On-Call Rotation

```
Monday-Friday:  8AM-8PM PST coverage
Weekend:        24/7 critical only
On-call tools:  PagerDuty

Escalation:
1. Page on-call engineer
2. If no response in 15 minutes → page manager
3. If manager no response → page director
```

### Incident Severity Levels

```
SEV-1: Entire platform down (RTO: 15 min)
SEV-2: Major feature down (RTO: 1 hour)
SEV-3: Minor issue (RTO: 4 hours)
SEV-4: Non-critical (RTO: 24 hours)
```

### Post-Incident Review

```markdown
## Incident Report Template

**Date:** 2024-01-15
**Duration:** 30 minutes
**Severity:** SEV-2

**What happened:**
[Description of incident]

**Root cause:**
[Why it happened]

**Impact:**
[Number of users affected, revenue impact]

**Resolution:**
[How it was fixed]

**Prevention:**
[Steps to prevent recurrence]

**Action items:**
- [ ] Fix root cause
- [ ] Add monitoring
- [ ] Update runbook
```

---

## 12. Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed
- [ ] Environment variables set
- [ ] Database migrations prepared
- [ ] Backups scheduled
- [ ] Monitoring configured
- [ ] Error tracking enabled
- [ ] CDN cache invalidation set
- [ ] SSL certificates valid
- [ ] Security headers configured
- [ ] API rate limiting enabled
- [ ] Logging configured
- [ ] Health checks monitored
- [ ] Rollback plan documented
- [ ] Team notified
- [ ] Post-deployment verification complete

---

## 13. Useful Commands

```bash
# Check service status
systemctl status syntheticai-api

# View logs
journalctl -u syntheticai-api -f

# Restart service
sudo systemctl restart syntheticai-api

# Update SSL certificate
sudo certbot renew --dry-run

# Database backup
pg_dump $DATABASE_URL | gzip > backup.sql.gz

# Test API health
curl https://api.syntheticai.com/api/health

# Check resource usage
top
df -h
du -sh /var/app
```
