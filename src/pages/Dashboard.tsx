import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Badge, Loading } from '../components/ui';
import { Link } from 'react-router-dom';
import { getProjects, createProject } from '../api';

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getProjects();
      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      setIsCreating(true);
      setError('');
      const newProject = await createProject({ name: newProjectName });
      setProjects([newProject, ...projects]);
      setNewProjectName('');
      setShowNewProjectForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'complete':
        return 'success';
      case 'in_progress':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'complete':
        return 'Ready to Export';
      case 'in_progress':
        return 'Generating...';
      default:
        return 'Draft';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-midnight to-slate-950 p-6 flex items-center justify-center">
        <Loading />
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
          className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="mt-2 text-slate-400">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'} • Ready to scale your digital product empire
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setShowNewProjectForm(true)}>
            + New Project
          </Button>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-red-200">
            {error}
          </div>
        )}

        {/* Create Project Form */}
        {showNewProjectForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Create New Project</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project name (e.g., AI Learning Platform)"
                className="flex-1 rounded-lg bg-slate-800/50 border border-white/10 px-4 py-2 text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
              />
              <Button
                variant="primary"
                onClick={handleCreateProject}
                loading={isCreating}
              >
                Create
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowNewProjectForm(false);
                  setNewProjectName('');
                }}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 grid gap-4 sm:grid-cols-3"
          >
            {[
              { label: 'Total Projects', value: projects.length },
              { label: 'Avg Demand Score', value: projects.length > 0 ? Math.round(projects.reduce((a: any, p: any) => a + (p.demand_score || 0), 0) / projects.length) : 0 },
              { label: 'Ready to Export', value: projects.filter(p => p.status?.toLowerCase() === 'complete').length },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur"
              >
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-cyan-400">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Controls */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex items-center justify-between"
          >
            <div className="text-sm text-slate-400">
              Showing {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg px-4 py-2 transition ${
                  viewMode === 'grid'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                ◊ Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-lg px-4 py-2 transition ${
                  viewMode === 'list'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                ≡ List
              </button>
            </div>
          </motion.div>
        )}

        {/* Projects Grid/List */}
        {projects.length > 0 ? (
          <div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}
          >
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="group rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur transition hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <Link to={`/project/${project.id}`}>
                  <div className="space-y-4">
                    {/* Thumbnail */}
                    <div className="flex h-20 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 text-4xl">
                      {project.emoji || '📊'}
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-cyan-400 transition">
                        {project.name}
                      </h3>
                      {project.niche && (
                        <p className="mt-1 text-sm text-slate-400">
                          {project.niche}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Demand Score */}
                    {project.demand_score && (
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-300">
                          <span className="font-semibold text-cyan-400">{project.demand_score}</span>/100 Demand
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <Badge
                        variant="status"
                        status={getStatusColor(project.status)}
                      >
                        {getStatusLabel(project.status)}
                      </Badge>
                      <button className="text-slate-400 hover:text-white transition">
                        ⋯
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-white/10 p-12 text-center"
          >
            <div className="mb-4 text-4xl">🚀</div>
            <h3 className="text-xl font-semibold text-white">No projects yet</h3>
            <p className="mt-2 text-slate-400">
              Create your first digital product project using AI
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowNewProjectForm(true)}
              className="mt-6"
            >
              Create First Project
            </Button>
          </motion.div>
        )}
      </div>
    </main>
  );
}