import { supabaseAdmin } from './supabase.js';
import { authenticateToken } from './auth.js';

// Middleware to check admin status (you would implement your own logic)
const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Check if user is admin (implement based on your needs)
    // For now, using a simple check based on user role or email
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    // Simple check - you'd have a proper admin field in production
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    if (!adminEmails.includes(user?.email)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    res.status(403).json({ error: 'Authorization failed' });
  }
};

export const setupAdminRoutes = (app) => {
  // Get dashboard metrics
  app.get('/api/admin/dashboard', authenticateToken, requireAdmin, async (req, res) => {
    try {
      // Get user count
      const { count: userCount } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get generation count
      const { count: generationCount } = await supabaseAdmin
        .from('ai_generations')
        .select('*', { count: 'exact', head: true });

      // Get export count
      const { count: exportCount } = await supabaseAdmin
        .from('exports')
        .select('*', { count: 'exact', head: true });

      // Get active users (users with generations in last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: activeUsers } = await supabaseAdmin
        .from('ai_generations')
        .select('user_id')
        .gte('created_at', sevenDaysAgo);

      const uniqueActiveUsers = new Set(activeUsers?.map(g => g.user_id) || []).size;

      res.json({
        metrics: {
          totalUsers: userCount || 0,
          activeUsers: uniqueActiveUsers,
          totalGenerations: generationCount || 0,
          totalExports: exportCount || 0,
          generationsPerUser: userCount > 0 ? (generationCount / userCount).toFixed(2) : 0,
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get user list with stats
  app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { page = 1, limit = 50 } = req.query;
      const offset = (page - 1) * limit;

      const { data: users, error } = await supabaseAdmin
        .from('users')
        .select('id, email, display_name, subscription_tier, credits, created_at')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      // Get generation count for each user
      const userStats = await Promise.all(users.map(async (user) => {
        const { count } = await supabaseAdmin
          .from('ai_generations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        return {
          ...user,
          generationCount: count || 0,
        };
      }));

      res.json({ users: userStats, page, limit });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get generation analytics
  app.get('/api/admin/generations', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { days = 30 } = req.query;
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      const { data: generations, error } = await supabaseAdmin
        .from('ai_generations')
        .select('created_at, demand_score, buyer_intent, competition')
        .gte('created_at', since)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Calculate average scores
      const avgDemandScore = generations.length > 0
        ? (generations.reduce((sum, g) => sum + (g.demand_score || 0), 0) / generations.length).toFixed(2)
        : 0;

      const avgBuyerIntent = generations.length > 0
        ? (generations.reduce((sum, g) => sum + (g.buyer_intent || 0), 0) / generations.length).toFixed(2)
        : 0;

      res.json({
        period: `Last ${days} days`,
        totalGenerations: generations.length,
        averageScores: {
          demandScore: avgDemandScore,
          buyerIntent: avgBuyerIntent,
        },
        generationsPerDay: (generations.length / days).toFixed(2),
      });
    } catch (error) {
      console.error('Error fetching generation analytics:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get export statistics
  app.get('/api/admin/exports', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { data: exports, error } = await supabaseAdmin
        .from('exports')
        .select('format, created_at')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      // Group by format
      const formatStats = {};
      exports.forEach(exp => {
        formatStats[exp.format] = (formatStats[exp.format] || 0) + 1;
      });

      res.json({
        totalExports: exports.length,
        byFormat: formatStats,
      });
    } catch (error) {
      console.error('Error fetching export statistics:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get usage trends
  app.get('/api/admin/trends', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const days = 30;
      const trends = [];

      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const { count: generations } = await supabaseAdmin
          .from('ai_generations')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', dateStr)
          .lt('created_at', nextDate.toISOString().split('T')[0]);

        const { count: exports } = await supabaseAdmin
          .from('exports')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', dateStr)
          .lt('created_at', nextDate.toISOString().split('T')[0]);

        trends.push({
          date: dateStr,
          generations: generations || 0,
          exports: exports || 0,
        });
      }

      res.json({ trends, period: `Last ${days} days` });
    } catch (error) {
      console.error('Error fetching trends:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get system health
  app.get('/api/admin/health', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        checks: {},
      };

      // Test database connection
      try {
        await supabaseAdmin
          .from('users')
          .select('*', { count: 'exact', head: true });
        health.checks.database = 'ok';
      } catch (err) {
        health.checks.database = 'error';
        health.status = 'unhealthy';
      }

      res.json(health);
    } catch (error) {
      console.error('Error checking health:', error);
      res.status(500).json({ error: error.message });
    }
  });
};
