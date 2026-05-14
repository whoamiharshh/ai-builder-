import { supabaseAdmin } from './supabase.js';

export const authenticateToken = async (req, res, next) => {
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

export const authenticateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ error: 'No API key provided' });
  }

  try {
    // Hash the API key and look it up
    const crypto = await import('crypto');
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

    const { data: keyRecord, error } = await supabaseAdmin
      .from('api_keys')
      .select('user_id')
      .eq('key_hash', keyHash)
      .is('revoked_at', null)
      .single();

    if (error || !keyRecord) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Update last used
    await supabaseAdmin
      .from('api_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('key_hash', keyHash)
      .catch(err => console.error('Failed to update last_used:', err));

    req.user = { id: keyRecord.user_id };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'API key auth failed' });
  }
};
