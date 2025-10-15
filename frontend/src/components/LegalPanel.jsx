// frontend/src/components/LegalPanel.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LegalPanel = ({ book }) => {
  if (!book) return null;

  const getLegalBadge = (status) => {
    const badges = {
      'public_domain': { 
        color: 'bg-green-500/20 text-green-200 border-green-500/30', 
        icon: '⚖️', 
        label: 'Public Domain' 
      },
      'cc_by': { 
        color: 'bg-blue-500/20 text-blue-200 border-blue-500/30', 
        icon: '🆓', 
        label: 'CC BY' 
      },
      'cc_by_sa': { 
        color: 'bg-purple-500/20 text-purple-200 border-purple-500/30', 
        icon: '🔄', 
        label: 'CC BY-SA' 
      },
      'unknown': { 
        color: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30', 
        icon: '❓', 
        label: 'Unknown' 
      }
    };
    
    return badges[status] || badges.unknown;
  };

  const badge = getLegalBadge(book.copyright_status);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-4"
    >
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        📋 Legal Information
      </h3>

      {/* Copyright Status */}
      <div className="space-y-2">
        <label className="text-sm text-indigo-300">Copyright Status</label>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm ${badge.color}`}>
          <span>{badge.icon}</span>
          <span>{badge.label}</span>
        </div>
      </div>

      {/* License */}
      {book.license && (
        <div className="space-y-2">
          <label className="text-sm text-indigo-300">License</label>
          <div className="text-white bg-white/10 px-3 py-2 rounded-lg text-sm">
            {book.license}
          </div>
        </div>
      )}

      {/* Source */}
      {book.source && (
        <div className="space-y-2">
          <label className="text-sm text-indigo-300">Source</label>
          <div className="text-white text-sm">
            {book.source_url ? (
              <a 
                href={book.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                {book.source}
              </a>
            ) : (
              book.source
            )}
          </div>
        </div>
      )}

      {/* Attribution Required */}
      {book.attribution_required && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <div className="text-blue-200 text-sm font-medium mb-1">
            ℹ️ Attribution Required
          </div>
          <div className="text-blue-300 text-xs">
            When using this work, please credit: {book.author}
          </div>
        </div>
      )}

      {/* Commercial Use */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-indigo-300">Commercial Use</span>
        <span className={`px-2 py-1 rounded text-xs ${
          book.commercial_use_allowed 
            ? 'bg-green-500/20 text-green-200' 
            : 'bg-red-500/20 text-red-200'
        }`}>
          {book.commercial_use_allowed ? '✅ Allowed' : '❌ Restricted'}
        </span>
      </div>

      {/* Legal Notes */}
      {book.legal_notes && (
        <div className="space-y-2">
          <label className="text-sm text-indigo-300">Legal Notes</label>
          <div className="text-xs text-gray-300 bg-white/5 p-2 rounded">
            {book.legal_notes}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400 border-t border-white/10 pt-2">
        Verified: {book.verification_date ? new Date(book.verification_date).toLocaleDateString() : 'Not verified'}
      </div>
    </motion.div>
  );
};

export default LegalPanel;