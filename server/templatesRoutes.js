import { supabaseAdmin } from './supabase.js';
import { authenticateToken } from './auth.js';

export const setupTemplateRoutes = (app) => {
  // Get all user templates
  app.get('/api/templates', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      
      const { data, error } = await supabaseAdmin
        .from('templates')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json({ templates: data });
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get templates by category
  app.get('/api/templates/category/:category', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { category } = req.params;

      const { data, error } = await supabaseAdmin
        .from('templates')
        .select('*')
        .eq('user_id', userId)
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json({ templates: data });
    } catch (error) {
      console.error('Error fetching templates by category:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get template by ID
  app.get('/api/templates/:id', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const { data, error } = await supabaseAdmin
        .from('templates')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Template not found' });
      }

      res.json({ template: data });
    } catch (error) {
      console.error('Error fetching template:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create new template
  app.post('/api/templates', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, description, category, generation_data } = req.body;

      if (!name || !generation_data) {
        return res.status(400).json({ error: 'Name and generation_data are required' });
      }

      const { data, error } = await supabaseAdmin
        .from('templates')
        .insert({
          user_id: userId,
          name,
          description: description || '',
          category: category || 'uncategorized',
          generation_data,
        })
        .select()
        .single();

      if (error) throw error;
      res.status(201).json({ template: data });
    } catch (error) {
      console.error('Error creating template:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update template
  app.put('/api/templates/:id', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { name, description, category, generation_data, is_public } = req.body;

      // Verify ownership
      const { data: template } = await supabaseAdmin
        .from('templates')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!template || template.user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { data, error } = await supabaseAdmin
        .from('templates')
        .update({
          name: name || undefined,
          description: description !== undefined ? description : undefined,
          category: category || undefined,
          generation_data: generation_data || undefined,
          is_public: is_public !== undefined ? is_public : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json({ template: data });
    } catch (error) {
      console.error('Error updating template:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete template
  app.delete('/api/templates/:id', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Verify ownership
      const { data: template } = await supabaseAdmin
        .from('templates')
        .select('user_id')
        .eq('id', id)
        .single();

      if (!template || template.user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { error } = await supabaseAdmin
        .from('templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ message: 'Template deleted' });
    } catch (error) {
      console.error('Error deleting template:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Increment usage count when template is used
  app.post('/api/templates/:id/use', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Verify ownership
      const { data: template } = await supabaseAdmin
        .from('templates')
        .select('user_id, usage_count')
        .eq('id', id)
        .single();

      if (!template || template.user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { data, error } = await supabaseAdmin
        .from('templates')
        .update({
          usage_count: (template.usage_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json({ template: data });
    } catch (error) {
      console.error('Error updating template usage:', error);
      res.status(500).json({ error: error.message });
    }
  });
};
