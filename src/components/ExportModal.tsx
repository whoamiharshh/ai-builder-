import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import exportService, { ExportConfig, ExportRecord } from '../services/exportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: any;
  metadata?: {
    author?: string;
    tags?: string[];
    projectName?: string;
    projectId?: string;
  };
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  metadata,
}) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formats, setFormats] = useState<string[]>([]);

  useEffect(() => {
    exportService.getFormats().then(setFormats).catch(console.error);
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      const config: ExportConfig = {
        format: selectedFormat,
        title,
        content,
        metadata: {
          ...metadata,
          created: new Date(),
        },
      };

      await exportService.exportAndDownload(config);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Export failed';
      setError(message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-lg bg-slate-900 p-6 shadow-xl dark:bg-white"
          >
            <h2 className="text-2xl font-bold text-white dark:text-slate-950 mb-4">
              Export {title}
            </h2>

            {/* Format Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 dark:text-slate-700 mb-3">
                Export Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {formats.map((format) => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors uppercase text-xs ${
                      selectedFormat === format
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-700 dark:hover:bg-slate-300'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-600 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Metadata Info */}
            <div className="mb-6 p-4 rounded-lg bg-slate-800 dark:bg-slate-100">
              <p className="text-sm text-slate-400 dark:text-slate-600">
                <strong>File:</strong> {title.toLowerCase().replace(/\s+/g, '-')}.{selectedFormat}
              </p>
              {metadata?.author && (
                <p className="text-sm text-slate-400 dark:text-slate-600">
                  <strong>Author:</strong> {metadata.author}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isExporting}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 transition-colors dark:bg-slate-300 dark:text-slate-900 dark:hover:bg-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
              >
                {isExporting ? 'Exporting...' : 'Download'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExportModal;
