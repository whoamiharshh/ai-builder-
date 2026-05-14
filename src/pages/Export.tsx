import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ExportModal from '../components/ExportModal';
import ExportHistory from '../components/ExportHistory';

const sampleContent = {
  productName: 'AI Launch Studio',
  description: 'A premium platform for generating AI products with professional workflows',
  features: [
    'AI-powered product generation',
    'Cinematic visual creation',
    'Professional document export',
    'Analytics and insights',
  ],
  pricing: 'Premium SaaS',
  launchDate: '2026',
};

export default function ExportPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'export' | 'history'>('export');

  const handleOpenExport = () => {
    setIsExportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight to-slate-900 dark:from-slate-50 dark:to-slate-100 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white dark:text-slate-950 mb-4">
            Export Studio
          </h1>
          <p className="text-lg text-slate-400 dark:text-slate-600">
            Export your projects in multiple formats for sharing and distribution
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('export')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'export'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 dark:bg-slate-300 dark:text-slate-900 dark:hover:bg-slate-400'
            }`}
          >
            New Export
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 dark:bg-slate-300 dark:text-slate-900 dark:hover:bg-slate-400'
            }`}
          >
            History
          </button>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-800/50 dark:bg-white/50 backdrop-blur-md rounded-xl p-8 border border-slate-700 dark:border-slate-300"
        >
          {activeTab === 'export' && (
            <div>
              <h2 className="text-2xl font-bold text-white dark:text-slate-950 mb-6">
                Export Your Project
              </h2>

              {/* Sample Content Preview */}
              <div className="mb-8 p-6 rounded-lg bg-slate-700/50 dark:bg-slate-100">
                <h3 className="text-lg font-semibold text-white dark:text-slate-950 mb-4">
                  Sample Content Preview
                </h3>
                <div className="space-y-2 text-slate-300 dark:text-slate-700">
                  <p>
                    <strong>Product:</strong> {sampleContent.productName}
                  </p>
                  <p>
                    <strong>Description:</strong> {sampleContent.description}
                  </p>
                  <p>
                    <strong>Features:</strong> {sampleContent.features.join(', ')}
                  </p>
                  <p>
                    <strong>Pricing:</strong> {sampleContent.pricing}
                  </p>
                </div>
              </div>

              {/* Export Instructions */}
              <div className="mb-8 space-y-4">
                <h3 className="text-lg font-semibold text-white dark:text-slate-950">
                  Supported Formats
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['PDF', 'DOCX', 'JSON', 'Markdown', 'HTML'].map((format) => (
                    <div
                      key={format}
                      className="p-3 rounded-lg bg-slate-700 dark:bg-slate-200 text-center"
                    >
                      <p className="font-medium text-white dark:text-slate-950">{format}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={handleOpenExport}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/50"
              >
                Export Sample Content
              </button>
            </div>
          )}

          {activeTab === 'history' && <ExportHistory />}
        </motion.div>

        {/* Export Modal */}
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          title="AI Launch Studio Sample"
          content={sampleContent}
          metadata={{
            author: 'SyntheticAI Studio',
            tags: ['AI', 'Product', 'Launch'],
          }}
        />
      </div>
    </div>
  );
}
