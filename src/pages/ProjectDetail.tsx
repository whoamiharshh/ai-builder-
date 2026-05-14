import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Loading, Card } from '../components/ui';
import { getProject, generateProduct, getGenerations } from '../api';
import ExportModal from '../components/ExportModal';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [generations, setGenerations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState<any>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError('');
      if (id) {
        const projectData = await getProject(id);
        setProject(projectData);

        const generationsData = await getGenerations(id);
        setGenerations(generationsData || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!generationPrompt.trim() || !id) {
      setError('Please enter a prompt');
      return;
    }

    try {
      setIsGenerating(true);
      setError('');
      const result = await generateProduct(generationPrompt, id);
      setSelectedGeneration(result);
      setGenerationPrompt('');
      await fetchProjectData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (selectedGeneration) {
      setShowExportModal(true);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-midnight to-slate-950 p-6 flex items-center justify-center">
        <Loading />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-midnight to-slate-950 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Project not found</h1>
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard')}
              className="mt-4"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-midnight to-slate-950 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="mb-4 text-slate-400 hover:text-white transition"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
            {project.niche && (
              <p className="mt-2 text-slate-400">Niche: {project.niche}</p>
            )}
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-red-200">
            {error}
          </div>
        )}

        {/* Generation Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Generate Product</h2>
          <div className="space-y-4">
            <textarea
              value={generationPrompt}
              onChange={(e) => setGenerationPrompt(e.target.value)}
              placeholder="Describe your product idea, target market, or any specific details to generate..."
              className="w-full rounded-lg bg-slate-800/50 border border-white/10 px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
              rows={4}
              disabled={isGenerating}
            />
            <Button
              variant="primary"
              size="lg"
              onClick={handleGenerate}
              loading={isGenerating}
              disabled={!generationPrompt.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Product'}
            </Button>
          </div>
        </motion.div>

        {/* Selected Generation Display */}
        {selectedGeneration && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 rounded-2xl border border-cyan-500/30 bg-slate-900/40 p-6 backdrop-blur"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Generated Product</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left side */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Title</p>
                  <p className="text-lg font-semibold text-white">{selectedGeneration.title}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Subtitle</p>
                  <p className="text-white">{selectedGeneration.subtitle}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Brand Name</p>
                  <p className="text-white">{selectedGeneration.brand_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Sales Copy</p>
                  <p className="text-slate-300 text-sm">{selectedGeneration.sales_copy}</p>
                </div>
              </div>

              {/* Right side - Scores */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-slate-800/50 p-4">
                    <p className="text-sm text-slate-400">Demand Score</p>
                    <p className="text-2xl font-bold text-cyan-400">{selectedGeneration.demand_score || 0}</p>
                  </div>
                  <div className="rounded-lg bg-slate-800/50 p-4">
                    <p className="text-sm text-slate-400">Buyer Intent</p>
                    <p className="text-2xl font-bold text-cyan-400">{selectedGeneration.buyer_intent || 0}</p>
                  </div>
                  <div className="rounded-lg bg-slate-800/50 p-4">
                    <p className="text-sm text-slate-400">Competition</p>
                    <p className="text-2xl font-bold text-orange-400">{selectedGeneration.competition || 0}</p>
                  </div>
                  <div className="rounded-lg bg-slate-800/50 p-4">
                    <p className="text-sm text-slate-400">Profitability</p>
                    <p className="text-2xl font-bold text-green-400">{selectedGeneration.profitability || 0}</p>
                  </div>
                </div>

                {/* Image */}
                {selectedGeneration.primary_image_url && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={selectedGeneration.primary_image_url}
                      alt="Generated product"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleExport}
                  className="w-full"
                >
                  Export Product
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Previous Generations */}
        {generations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-white mb-4">Previous Generations</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {generations.map((gen, i) => (
                <Card
                  key={gen.id}
                  className="p-4 cursor-pointer hover:border-cyan-500/50 transition"
                  onClick={() => setSelectedGeneration(gen)}
                >
                  <h3 className="font-semibold text-white truncate">{gen.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Demand: <span className="text-cyan-400 font-bold">{gen.demand_score || 0}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(gen.created_at).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {generations.length === 0 && !selectedGeneration && (
          <div className="text-center py-12">
            <p className="text-slate-400">No generations yet. Create one above to get started!</p>
          </div>
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title={selectedGeneration?.title || 'Product'}
        content={selectedGeneration || {}}
        metadata={{
          projectName: project.name,
          projectId: project.id,
        }}
      />
    </main>
  );
}
