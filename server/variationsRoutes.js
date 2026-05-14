import { supabaseAdmin } from './supabase.js';
import { authenticateToken } from './auth.js';
import { generateProductFromAI } from './aiService.js';

export const setupVariationsRoutes = (app) => {
  // Get all variations for a generation
  app.get('/api/variations/:generationId', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { generationId } = req.params;

      const { data, error } = await supabaseAdmin
        .from('variations')
        .select('*')
        .eq('generation_id', generationId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json({ variations: data });
    } catch (error) {
      console.error('Error fetching variations:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Generate product variations
  app.post('/api/variations/generate', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { generationId, prompt, variationCount = 2 } = req.body;

      if (!generationId || !prompt) {
        return res.status(400).json({ error: 'generationId and prompt are required' });
      }

      // Verify generation ownership
      const { data: generation } = await supabaseAdmin
        .from('ai_generations')
        .select('id')
        .eq('id', generationId)
        .eq('user_id', userId)
        .single();

      if (!generation) {
        return res.status(404).json({ error: 'Generation not found' });
      }

      // Generate variations
      const variations = [];
      for (let i = 0; i < Math.min(variationCount, 3); i++) {
        const variationPrompt = `${prompt} - Variation ${i + 1}: ${['Focus on luxury market', 'Focus on budget segment', 'Focus on eco-conscious buyers'][i]}`;
        
        try {
          const variationData = await generateProductFromAI(variationPrompt);
          
          const { data: variation, error: insertError } = await supabaseAdmin
            .from('variations')
            .insert({
              generation_id: generationId,
              user_id: userId,
              variation_type: ['premium', 'budget', 'eco'][i],
              variation_data: variationData,
              test_status: 'pending',
              metrics: {
                demandScore: variationData.demandScore || 0,
                buyerIntent: variationData.buyerIntent || 0,
              },
            })
            .select()
            .single();

          if (!insertError && variation) {
            variations.push(variation);
          }
        } catch (err) {
          console.error(`Error generating variation ${i + 1}:`, err);
        }
      }

      res.status(201).json({ variations });
    } catch (error) {
      console.error('Error generating variations:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get variation by ID
  app.get('/api/variations/:generationId/:variationId', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { variationId } = req.params;

      const { data, error } = await supabaseAdmin
        .from('variations')
        .select('*')
        .eq('id', variationId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Variation not found' });
      }

      res.json({ variation: data });
    } catch (error) {
      console.error('Error fetching variation:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update variation test status
  app.put('/api/variations/:variationId', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { variationId } = req.params;
      const { test_status, metrics } = req.body;

      // Verify ownership
      const { data: variation } = await supabaseAdmin
        .from('variations')
        .select('user_id')
        .eq('id', variationId)
        .single();

      if (!variation || variation.user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { data, error } = await supabaseAdmin
        .from('variations')
        .update({
          test_status: test_status || undefined,
          metrics: metrics || undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', variationId)
        .select()
        .single();

      if (error) throw error;
      res.json({ variation: data });
    } catch (error) {
      console.error('Error updating variation:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Compare variations (A/B testing)
  app.post('/api/variations/compare', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { variationIds } = req.body;

      if (!Array.isArray(variationIds) || variationIds.length < 2) {
        return res.status(400).json({ error: 'At least 2 variation IDs required' });
      }

      const { data: variations, error } = await supabaseAdmin
        .from('variations')
        .select('*')
        .in('id', variationIds)
        .eq('user_id', userId);

      if (error) throw error;

      if (!variations || variations.length === 0) {
        return res.status(404).json({ error: 'Variations not found' });
      }

      // Calculate comparison metrics
      const comparison = variations.map(v => ({
        id: v.id,
        type: v.variation_type,
        metrics: v.metrics,
        testStatus: v.test_status,
      }));

      res.json({ comparison, count: variations.length });
    } catch (error) {
      console.error('Error comparing variations:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete variation
  app.delete('/api/variations/:variationId', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { variationId } = req.params;

      // Verify ownership
      const { data: variation } = await supabaseAdmin
        .from('variations')
        .select('user_id')
        .eq('id', variationId)
        .single();

      if (!variation || variation.user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { error } = await supabaseAdmin
        .from('variations')
        .delete()
        .eq('id', variationId);

      if (error) throw error;
      res.json({ message: 'Variation deleted' });
    } catch (error) {
      console.error('Error deleting variation:', error);
      res.status(500).json({ error: error.message });
    }
  });
};
