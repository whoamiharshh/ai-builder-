import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { supabaseAdmin } from './supabase.js';
import { generateImageFromAI, generateProductFromAI } from './aiService.js';
import { ExportEngine, EXPORT_FORMATS } from './exportEngine.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'];

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'"],
      connectSrc: ["'self'", 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: 'deny',
  },
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
}));

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Auth middleware
const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Auth failed' });
  }
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SyntheticAI API' });
});

app.post('/api/generate', requireAuth, async (req, res) => {
  const prompt = String(req.body.prompt || '').trim();
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const result = await generateProductFromAI(prompt);
    // Save to database
    const { error } = await supabaseAdmin
      .from('projects')
      .insert({
        user_id: req.user.id,
        prompt,
        result,
        created_at: new Date().toISOString(),
      });

    if (error) console.error('DB save error:', error);

    return res.json(result);
  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({ error: 'Generation failed', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/generate-image', requireAuth, async (req, res) => {
  const prompt = String(req.body.prompt || '').trim();
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const result = await generateImageFromAI(prompt);
    return res.json(result);
  } catch (error) {
    console.error('Image generation error:', error);
    return res.status(500).json({ error: 'Image generation failed', details: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Export endpoints
app.get('/api/export/formats', (req, res) => {
  res.json({
    formats: Object.values(EXPORT_FORMATS),
  });
});

app.post('/api/export', requireAuth, async (req, res) => {
  const { format, title, content, metadata } = req.body;

  if (!format || !title || !content) {
    return res.status(400).json({ error: 'Format, title, and content are required' });
  }

  try {
    // Validate format
    if (!Object.values(EXPORT_FORMATS).includes(format.toLowerCase())) {
      return res.status(400).json({ error: `Invalid format: ${format}` });
    }

    // Generate export
    const buffer = await ExportEngine.export({
      format,
      title,
      content,
      metadata,
    });

    const filename = ExportEngine.getFilename(title, format);

    // Set response headers
    const contentTypeMap = {
      pdf: 'application/pdf',
      json: 'application/json',
      markdown: 'text/markdown',
      html: 'text/html',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    res.setHeader('Content-Type', contentTypeMap[format.toLowerCase()] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    // Log export to database
    await supabaseAdmin
      .from('exports')
      .insert({
        user_id: req.user.id,
        format,
        title,
        filename,
        size: buffer.length,
        created_at: new Date().toISOString(),
      })
      .catch((err) => console.error('Failed to log export:', err));

    return res.send(buffer);
  } catch (error) {
    console.error('Export error:', error);
    return res.status(500).json({
      error: 'Export failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/api/exports', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('exports')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch exports' });
    }

    return res.json(data || []);
  } catch (error) {
    console.error('Fetch exports error:', error);
    return res.status(500).json({
      error: 'Failed to fetch exports',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// =====================
// USER PROFILE ENDPOINTS
// =====================

app.get('/api/user/profile', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, display_name, avatar_url, subscription_tier, credits')
      .eq('id', req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(data);
  } catch (error) {
    console.error('Fetch user error:', error);
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

app.put('/api/user/profile', requireAuth, async (req, res) => {
  const { display_name, avatar_url } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        display_name: display_name || undefined,
        avatar_url: avatar_url || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Failed to update profile' });
    }

    return res.json(data);
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

// =====================
// PROJECT ENDPOINTS
// =====================

app.get('/api/projects', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }

    return res.json(data || []);
  } catch (error) {
    console.error('Fetch projects error:', error);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/projects', requireAuth, async (req, res) => {
  const { name, description, niche } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert({
        user_id: req.user.id,
        name,
        description: description || '',
        niche: niche || '',
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Failed to create project' });
    }

    return res.status(201).json(data);
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ error: 'Failed to create project' });
  }
});

app.get('/api/projects/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.json(data);
  } catch (error) {
    console.error('Fetch project error:', error);
    return res.status(500).json({ error: 'Failed to fetch project' });
  }
});

app.put('/api/projects/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name, description, niche, status } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update({
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        niche: niche !== undefined ? niche : undefined,
        status: status || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Project not found or update failed' });
    }

    return res.json(data);
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ error: 'Failed to delete project' });
  }
});

// =====================
// GENERATION ENDPOINTS (Enhanced)
// =====================

app.post('/api/generate', requireAuth, async (req, res) => {
  const { projectId, prompt } = req.body;
  const trimmedPrompt = String(prompt || '').trim();

  if (!trimmedPrompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const result = await generateProductFromAI(trimmedPrompt);

    // Save generation to database
    const { data: generation, error: dbError } = await supabaseAdmin
      .from('ai_generations')
      .insert({
        project_id: projectId || null,
        user_id: req.user.id,
        niche: result.niche || '',
        demand_score: result.demand_score || 0,
        buyer_intent: result.buyer_intent || 0,
        competition: result.competition || 0,
        title: result.title || '',
        subtitle: result.subtitle || '',
        content: result.content || {},
        sales_copy: result.sales_copy || '',
        brand_name: result.brand_name || '',
        primary_image_url: result.primary_image_url || '',
        status: 'complete',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) console.error('DB save error:', dbError);

    return res.json({ ...result, generationId: generation?.id });
  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({
      error: 'Generation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/api/generations/:projectId', requireAuth, async (req, res) => {
  const { projectId } = req.params;

  try {
    const { data, error } = await supabaseAdmin
      .from('ai_generations')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch generations' });
    }

    return res.json(data || []);
  } catch (error) {
    console.error('Fetch generations error:', error);
    return res.status(500).json({ error: 'Failed to fetch generations' });
  }
});

// =====================
// ERROR HANDLING MIDDLEWARE
// =====================

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS error: Origin not allowed' });
  }

  // Validation error
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // Default error response
  return res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(port, () => {
  console.log(`SyntheticAI server listening on http://localhost:${port}`);
});
