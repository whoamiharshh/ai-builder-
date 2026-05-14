import { supabaseAdmin } from './supabase.js';
import { authenticateToken } from './auth.js';
import crypto from 'crypto';

export const setupApiKeysRoutes = (app) => {
  // Generate new API key
  app.post('/api/keys', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'API key name is required' });
      }

      // Generate random API key
      const apiKey = `synai_${crypto.randomBytes(32).toString('hex')}`;
      const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

      const { data, error } = await supabaseAdmin
        .from('api_keys')
        .insert({
          user_id: userId,
          key_hash: keyHash,
          name,
        })
        .select()
        .single();

      if (error) throw error;

      // Return the actual key (only time it's shown)
      res.status(201).json({
        id: data.id,
        name: data.name,
        apiKey, // Only sent once!
        createdAt: data.created_at,
      });
    } catch (error) {
      console.error('Error generating API key:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // List user's API keys (without revealing full key)
  app.get('/api/keys', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;

      const { data, error } = await supabaseAdmin
        .from('api_keys')
        .select('id, name, last_used, created_at')
        .eq('user_id', userId)
        .is('revoked_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const keys = data.map(key => ({
        id: key.id,
        name: key.name,
        lastUsed: key.last_used,
        createdAt: key.created_at,
      }));

      res.json({ keys });
    } catch (error) {
      console.error('Error fetching API keys:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get API key details (without revealing full key)
  app.get('/api/keys/:id', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const { data, error } = await supabaseAdmin
        .from('api_keys')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'API key not found' });
      }

      // Don't return the key hash
      res.json({
        id: data.id,
        name: data.name,
        lastUsed: data.last_used,
        createdAt: data.created_at,
      });
    } catch (error) {
      console.error('Error fetching API key:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Revoke API key
  app.delete('/api/keys/:id', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Verify ownership
      const { data: key } = await supabaseAdmin
        .from('api_keys')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!key || key.user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { error } = await supabaseAdmin
        .from('api_keys')
        .update({ revoked_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      res.json({ message: 'API key revoked' });
    } catch (error) {
      console.error('Error revoking API key:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get API key usage stats
  app.get('/api/keys/:id/usage', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Verify ownership
      const { data: key } = await supabaseAdmin
        .from('api_keys')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!key || key.user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // Calculate usage from last_used timestamp
      // This is a simplified version - in production, you'd track each API call
      const lastUsed = key.last_used ? new Date(key.last_used) : null;
      const daysSinceLastUse = lastUsed 
        ? Math.floor((Date.now() - lastUsed.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      res.json({
        id: key.id,
        name: key.name,
        createdAt: key.created_at,
        lastUsed: key.last_used,
        daysSinceLastUse,
        status: key.revoked_at ? 'revoked' : 'active',
      });
    } catch (error) {
      console.error('Error fetching API key usage:', error);
      res.status(500).json({ error: error.message });
    }
  });
};
