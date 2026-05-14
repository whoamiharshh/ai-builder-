# SyntheticAI Security Best Practices

## Overview

Security is fundamental to SyntheticAI. This document outlines security policies, best practices, and implementation patterns.

---

## 1. Authentication & Authorization

### API Key Management

```typescript
// ✅ Good: API keys in environment variables
const API_KEY = process.env.OPENROUTER_API_KEY;

// ❌ Bad: API keys in code
const API_KEY = 'sk-xxxxx'; // NEVER!
```

### JWT Token Implementation

```typescript
import jwt from 'jsonwebtoken';

// Create token
export function createToken(userId: string) {
  return jwt.sign(
    { userId, iat: Date.now() },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
}

// Verify token
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```

### Session Management

```typescript
// Store JWT in httpOnly cookie (not localStorage)
res.cookie('auth_token', token, {
  httpOnly: true,           // Prevents XSS attacks
  secure: process.env.NODE_ENV === 'production',  // HTTPS only
  sameSite: 'strict',       // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

---

## 2. Data Protection

### Password Security

```typescript
import bcrypt from 'bcrypt';

// Hash password
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(12); // Rounds of salting
  return bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// Never log or expose passwords
console.log(password); // ❌ Never
console.log('User attempting login'); // ✅ Good
```

### Encryption for Sensitive Data

```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 bytes

export function encryptData(data: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY), iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

export function decryptData(data: string): string {
  const [iv, tag, encrypted] = data.split(':');
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(ENCRYPTION_KEY),
    Buffer.from(iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

---

## 3. API Security

### CORS Configuration

```typescript
import cors from 'cors';

app.use(cors({
  origin: [
    'http://localhost:5173',           // Development
    'https://syntheticai.com',         // Production
    'https://app.syntheticai.com',     // App subdomain
  ],
  credentials: true,                   // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,     // 15 minutes
  max: 100,                      // Limit to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to all requests
app.use(limiter);

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // 5 attempts per 15 minutes
});

app.post('/login', authLimiter, authController.login);
```

### Request Validation

```typescript
import { z } from 'zod';

const generateSchema = z.object({
  prompt: z.string().min(3).max(500),
  style: z.enum(['professional', 'casual', 'luxury']).optional(),
  targetAudience: z.string().optional(),
});

app.post('/api/generate', (req, res, next) => {
  try {
    const validated = generateSchema.parse(req.body);
    req.body = validated;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});
```

### SQL Injection Prevention

```typescript
// ❌ Bad: String concatenation
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Good: Parameterized queries
const result = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
```

### XSS Prevention

```typescript
// React escapes by default
<div>{userInput}</div> // ✅ Safe

// But be careful with dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // ❌ Dangerous

// If you must use HTML:
import DOMPurify from 'dompurify';

const clean = DOMPurify.sanitize(userInput);
<div dangerouslySetInnerHTML={{ __html: clean }} /> // ✅ Safer
```

---

## 4. File Upload Security

```typescript
import multer from 'multer';
import path from 'path';

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Only allow specific file types
    const allowed = ['.pdf', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname);
    
    if (!allowed.includes(ext)) {
      return cb(new Error('Invalid file type'));
    }
    
    cb(null, true);
  },
});

app.post('/upload', upload.single('file'), (req, res) => {
  // File is validated and uploaded
  res.json({ success: true });
});
```

---

## 5. Third-Party API Security

### API Key Rotation

```typescript
// Store API keys in environment variables, not in code
// Rotate keys every 90 days

// ✅ Good pattern:
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

// Check for key expiration
if (isKeyExpired(OPENROUTER_KEY)) {
  logger.warn('API key expiring soon');
  // Alert admin
}
```

### Request Signing

```typescript
// For sensitive API calls, sign requests
import crypto from 'crypto';

function signRequest(data: string, secret: string) {
  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex');
}

// In request
const signature = signRequest(JSON.stringify(payload), API_SECRET);
headers['X-Signature'] = signature;
```

---

## 6. Database Security

### Row Level Security (RLS)

```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_select_policy ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can only update their own data
CREATE POLICY users_update_policy ON users
  FOR UPDATE
  USING (auth.uid() = id);
```

### Secrets in Database

```typescript
// ❌ Never store secrets directly
INSERT INTO api_keys (user_id, key) VALUES (1, 'sk_xxxx');

// ✅ Store hashed key
const hashedKey = hashKey('sk_xxxx');
INSERT INTO api_keys (user_id, key_hash) VALUES (1, hashedKey);

// Compare when verifying
const isValid = await bcrypt.compare(providedKey, storedHash);
```

---

## 7. Frontend Security

### Content Security Policy (CSP)

```html
<!-- In HTML head -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'wasm-unsafe-eval' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' https: data:;
  connect-src 'self' https://api.syntheticai.com;
  frame-src 'none';
">
```

### Secure Headers

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'wasm-unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  xContentTypeOptions: { noSniff: true },
  xFrameOptions: { action: 'deny' },
  xXssProtection: { mode: 'block' },
}));
```

### Input Validation on Frontend

```typescript
// Validate before sending to API
interface FormData {
  email: string;
  password: string;
}

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const handleSubmit = async (data: unknown) => {
  try {
    const validated = schema.parse(data);
    // Send to API
  } catch (error) {
    // Show validation error
  }
};
```

---

## 8. Infrastructure Security

### Environment Variables

```bash
# ✅ Good: Use .env with secrets
OPENROUTER_API_KEY=sk_xxxx
STRIPE_SECRET_KEY=sk_xxxx

# ❌ Never commit .env file
# Add to .gitignore
.env
.env.local
.env.*.local
```

### HTTPS Enforcement

```typescript
// Force HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
    return res.redirect(301, `https://${req.header('host')}${req.url}`);
  }
  next();
});
```

### Database Backups

```bash
# Regular automated backups
0 2 * * * pg_dump postgres://... | gzip > backup-$(date +\%Y\%m\%d).sql.gz

# Backup encryption
gpg --symmetric backup.sql.gz

# Backup to S3
aws s3 cp backup.sql.gz s3://backups/ --sse AES256
```

---

## 9. Logging & Monitoring

### Secure Logging

```typescript
// ❌ Bad: Logging sensitive data
logger.info(`User ${email} logged in with password ${password}`);

// ✅ Good: Log only necessary info
logger.info(`User ${email} logged in`);
logger.error(`Authentication failed for user ${email}`);
```

### Security Event Monitoring

```typescript
// Track suspicious activities
if (failedLoginAttempts > 5) {
  logger.warn(`Multiple failed logins from ${ip}`);
  // Alert admin
  // Consider blocking IP
}

// Audit logging
auditLog.create({
  userId,
  action: 'project_exported',
  timestamp: new Date(),
  ipAddress: req.ip,
});
```

---

## 10. Incident Response

### Security Incident Checklist

- [ ] Identify the incident type (breach, attack, misconfiguration, etc.)
- [ ] Contain the incident (disable affected services if necessary)
- [ ] Assess the scope (how many users affected?)
- [ ] Preserve evidence (logs, backups)
- [ ] Notify affected users
- [ ] Notify relevant authorities if required
- [ ] Communicate with stakeholders
- [ ] Post-incident review and improvements

### Breach Notification Plan

```typescript
async function notifyUsersOfBreach(affectedUserIds: string[]) {
  for (const userId of affectedUserIds) {
    const user = await db.query('SELECT email FROM users WHERE id = $1', [userId]);
    
    await emailService.send({
      to: user.email,
      subject: 'Important Security Notice',
      template: 'security_breach_notification',
      data: {
        incidentDate: new Date(),
        recommendedActions: [
          'Change your password',
          'Enable two-factor authentication',
          'Review account activity',
        ],
      },
    });
  }
}
```

---

## 11. Security Compliance

### GDPR Compliance

- Implement user data export functionality
- Provide easy account deletion
- Get explicit consent for data collection
- Maintain privacy policy
- Handle data breach notifications within 72 hours

### CCPA Compliance

- Allow users to see what data is collected
- Allow users to delete their data
- Don't sell user data without consent
- Disclose data practices clearly

### SOC 2 Compliance

- Document security policies
- Implement access controls
- Maintain audit logs
- Regular security audits
- Incident response procedures

---

## 12. Security Checklist

- [ ] All API keys in environment variables
- [ ] Passwords hashed with bcrypt
- [ ] JWT tokens with expiration
- [ ] HTTPS enforced in production
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Input validation on frontend and backend
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (escape user input)
- [ ] CSRF tokens implemented
- [ ] Database backups encrypted and stored securely
- [ ] Secrets not in version control
- [ ] Security headers configured (CSP, HSTS, X-Frame-Options)
- [ ] Audit logging implemented
- [ ] Incident response plan documented
- [ ] Regular security audits scheduled
- [ ] Team trained on security practices
- [ ] Third-party dependencies up to date

---

## 12. Resources & References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [React Security Best Practices](https://snyk.io/blog/10-react-security-best-practices/)
- [API Security Standards](https://swagger.io/resources/articles/best-practices-in-api-security/)
