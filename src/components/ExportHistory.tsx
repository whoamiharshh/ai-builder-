import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import exportService, { ExportRecord } from '../services/exportService';

export const ExportHistory: React.FC = () => {
  const [exports, setExports] = useState<ExportRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExports();
  }, []);

  const fetchExports = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await exportService.getExports();
      setExports(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load exports';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white dark:text-slate-950 mb-4">
        Export History
      </h3>

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-slate-400 dark:text-slate-600">Loading...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-900/30 border border-red-600 text-red-200 mb-4">
          {error}
        </div>
      )}

      {!isLoading && exports.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400 dark:text-slate-600">
            No exports yet. Export a project to get started!
          </p>
        </div>
      )}

      {!isLoading && exports.length > 0 && (
        <div className="space-y-2">
          {exports.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-lg bg-slate-800 dark:bg-slate-100 hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-white dark:text-slate-950 truncate">
                    {exp.title}
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-600 mt-1">
                    <span className="inline-block mr-3">
                      <strong>Format:</strong> {exp.format.toUpperCase()}
                    </span>
                    <span className="inline-block mr-3">
                      <strong>Size:</strong> {exportService.formatFileSize(exp.size)}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {formatDate(exp.created_at)}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-400">
                    {exp.format}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExportHistory;
