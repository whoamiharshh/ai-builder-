import { supabaseAdmin } from './supabase.js';
import { authenticateToken } from './auth.js';
import { generateProductFromAI } from './aiService.js';

export const setupBulkRoutes = (app) => {
  // Upload CSV and start bulk generation
  app.post('/api/bulk/generate', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { jobName, csvData } = req.body;

      if (!csvData || !Array.isArray(csvData)) {
        return res.status(400).json({ error: 'CSV data array is required' });
      }

      // Create bulk job record
      const { data: job, error: jobError } = await supabaseAdmin
        .from('bulk_jobs')
        .insert({
          user_id: userId,
          job_name: jobName || `Bulk Job ${new Date().toLocaleDateString()}`,
          status: 'processing',
          input_csv: JSON.stringify(csvData),
          total_items: csvData.length,
          completed_items: 0,
          results: [],
        })
        .select()
        .single();

      if (jobError) throw jobError;

      res.status(202).json({ 
        jobId: job.id, 
        message: 'Bulk generation started',
        totalItems: csvData.length 
      });

      // Process asynchronously (don't await)
      processBulkJob(job.id, userId, csvData).catch(err => {
        console.error('Bulk processing error:', err);
        supabaseAdmin
          .from('bulk_jobs')
          .update({ 
            status: 'failed',
            error_message: err.message 
          })
          .eq('id', job.id)
          .catch(e => console.error('Failed to update job status:', e));
      });
    } catch (error) {
      console.error('Error starting bulk generation:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get bulk job status
  app.get('/api/bulk/:jobId', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { jobId } = req.params;

      const { data, error } = await supabaseAdmin
        .from('bulk_jobs')
        .select('*')
        .eq('id', jobId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.json({
        jobId: data.id,
        status: data.status,
        progress: data.total_items > 0 ? Math.round((data.completed_items / data.total_items) * 100) : 0,
        completed: data.completed_items,
        total: data.total_items,
        createdAt: data.created_at,
        completedAt: data.completed_at,
        errorMessage: data.error_message,
      });
    } catch (error) {
      console.error('Error fetching job status:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get bulk job results
  app.get('/api/bulk/:jobId/results', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { jobId } = req.params;

      const { data, error } = await supabaseAdmin
        .from('bulk_jobs')
        .select('*')
        .eq('id', jobId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Job not found' });
      }

      if (data.status !== 'completed') {
        return res.status(400).json({ error: 'Job is not yet complete' });
      }

      const results = typeof data.results === 'string' ? JSON.parse(data.results) : data.results;
      
      res.json({
        jobId: data.id,
        results,
        completedAt: data.completed_at,
      });
    } catch (error) {
      console.error('Error fetching job results:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // List user's bulk jobs
  app.get('/api/bulk', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;

      const { data, error } = await supabaseAdmin
        .from('bulk_jobs')
        .select('id, job_name, status, total_items, completed_items, created_at, completed_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const jobs = data.map(job => ({
        jobId: job.id,
        name: job.job_name,
        status: job.status,
        progress: job.total_items > 0 ? Math.round((job.completed_items / job.total_items) * 100) : 0,
        completed: job.completed_items,
        total: job.total_items,
        createdAt: job.created_at,
        completedAt: job.completed_at,
      }));

      res.json({ jobs });
    } catch (error) {
      console.error('Error fetching bulk jobs:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete bulk job
  app.delete('/api/bulk/:jobId', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { jobId } = req.params;

      // Verify ownership
      const { data: job } = await supabaseAdmin
        .from('bulk_jobs')
        .select('user_id')
        .eq('id', jobId)
        .single();

      if (!job || job.user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const { error } = await supabaseAdmin
        .from('bulk_jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
      res.json({ message: 'Job deleted' });
    } catch (error) {
      console.error('Error deleting job:', error);
      res.status(500).json({ error: error.message });
    }
  });
};

// Background processing function
async function processBulkJob(jobId, userId, csvData) {
  const results = [];

  for (let i = 0; i < csvData.length; i++) {
    try {
      const item = csvData[i];
      const prompt = typeof item === 'string' ? item : item.prompt;

      if (!prompt) {
        results.push({
          index: i,
          status: 'error',
          error: 'No prompt provided',
        });
        continue;
      }

      const result = await generateProductFromAI(prompt);

      results.push({
        index: i,
        status: 'success',
        data: result,
      });

      // Update progress
      await supabaseAdmin
        .from('bulk_jobs')
        .update({
          completed_items: i + 1,
          results: JSON.stringify(results),
        })
        .eq('id', jobId)
        .catch(err => console.error('Failed to update progress:', err));

    } catch (error) {
      console.error(`Error processing item ${i}:`, error);
      results.push({
        index: i,
        status: 'error',
        error: error.message,
      });
    }

    // Add small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Mark job as completed
  await supabaseAdmin
    .from('bulk_jobs')
    .update({
      status: 'completed',
      completed_items: csvData.length,
      results: JSON.stringify(results),
      completed_at: new Date().toISOString(),
    })
    .eq('id', jobId)
    .catch(err => console.error('Failed to mark job complete:', err));
}
