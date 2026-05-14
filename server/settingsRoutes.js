import { supabaseAdmin } from './supabase.js';
import { authenticateToken } from './auth.js';

export const setupSettingsRoutes = (app) => {
  // Get user settings
  app.get('/api/settings', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;

      let { data, error } = await supabaseAdmin
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      // If no settings exist, create default ones
      if (error && error.code === 'PGRST116') {
        const { data: newSettings, error: createError } = await supabaseAdmin
          .from('user_settings')
          .insert({
            user_id: userId,
            export_defaults: { format: 'pdf', includeAssets: true },
            notification_preferences: { emailUpdates: true, generationComplete: true },
            theme: 'light',
            api_tier: 'free',
          })
          .select()
          .single();

        if (createError) throw createError;
        data = newSettings;
      } else if (error) {
        throw error;
      }

      res.json({
        settings: {
          id: data.id,
          exportDefaults: data.export_defaults,
          notificationPreferences: data.notification_preferences,
          theme: data.theme,
          apiTier: data.api_tier,
          maxConcurrentJobs: data.max_concurrent_jobs,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update user settings
  app.put('/api/settings', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { 
        exportDefaults, 
        notificationPreferences, 
        theme, 
        maxConcurrentJobs 
      } = req.body;

      // Prepare update object
      const updates = {
        updated_at: new Date().toISOString(),
      };

      if (exportDefaults) updates.export_defaults = exportDefaults;
      if (notificationPreferences) updates.notification_preferences = notificationPreferences;
      if (theme) updates.theme = theme;
      if (maxConcurrentJobs) updates.max_concurrent_jobs = maxConcurrentJobs;

      // Try to update existing settings
      let { data, error } = await supabaseAdmin
        .from('user_settings')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      // If not found, create new settings
      if (error && error.code === 'PGRST116') {
        const { data: newSettings, error: createError } = await supabaseAdmin
          .from('user_settings')
          .insert({
            user_id: userId,
            ...updates,
            export_defaults: exportDefaults || { format: 'pdf', includeAssets: true },
            notification_preferences: notificationPreferences || { emailUpdates: true, generationComplete: true },
            theme: theme || 'light',
          })
          .select()
          .single();

        if (createError) throw createError;
        data = newSettings;
      } else if (error) {
        throw error;
      }

      res.json({
        settings: {
          id: data.id,
          exportDefaults: data.export_defaults,
          notificationPreferences: data.notification_preferences,
          theme: data.theme,
          apiTier: data.api_tier,
          maxConcurrentJobs: data.max_concurrent_jobs,
          updatedAt: data.updated_at,
        }
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update theme preference
  app.patch('/api/settings/theme', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { theme } = req.body;

      if (!['light', 'dark', 'system'].includes(theme)) {
        return res.status(400).json({ error: 'Invalid theme value' });
      }

      const { data, error } = await supabaseAdmin
        .from('user_settings')
        .update({ 
          theme,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      res.json({ 
        theme: data.theme,
        message: 'Theme updated successfully'
      });
    } catch (error) {
      console.error('Error updating theme:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update export defaults
  app.patch('/api/settings/export-defaults', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { format, includeAssets } = req.body;

      if (format && !['pdf', 'docx', 'json', 'html', 'markdown'].includes(format)) {
        return res.status(400).json({ error: 'Invalid export format' });
      }

      const { data, error } = await supabaseAdmin
        .from('user_settings')
        .update({
          export_defaults: {
            format: format || 'pdf',
            includeAssets: includeAssets !== undefined ? includeAssets : true,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      res.json({ 
        exportDefaults: data.export_defaults,
        message: 'Export defaults updated successfully'
      });
    } catch (error) {
      console.error('Error updating export defaults:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update notification preferences
  app.patch('/api/settings/notifications', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { emailUpdates, generationComplete, exportReady } = req.body;

      const { data, error } = await supabaseAdmin
        .from('user_settings')
        .update({
          notification_preferences: {
            emailUpdates: emailUpdates !== undefined ? emailUpdates : true,
            generationComplete: generationComplete !== undefined ? generationComplete : true,
            exportReady: exportReady !== undefined ? exportReady : true,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      res.json({ 
        notificationPreferences: data.notification_preferences,
        message: 'Notification preferences updated successfully'
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      res.status(500).json({ error: error.message });
    }
  });
};
