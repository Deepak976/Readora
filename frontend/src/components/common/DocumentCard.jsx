// frontend/src/components/common/DocumentCard.jsx
import React from "react";
import { motion } from "framer-motion";

export default function DocumentCard({ document, index, openViewer, handleDownload, setDeleteConfirm }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (filename) => {
    if (!filename) return '📄';
    const ext = filename.toLowerCase().split('.').pop();
    switch (ext) {
      case 'pdf': return '📕';
      case 'doc':
      case 'docx': return '📘';
      case 'txt': return '📄';
      case 'xls':
      case 'xlsx': return '📊';
      case 'ppt':
      case 'pptx': return '📙';
      default: return '📄';
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-600/30 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      {/* Document Header */}
      <div className="flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-gradient-to-br from-gray-600 to-gray-700 w-12 h-16 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {getFileIcon(document.filename)}
          </div>
          <div className="flex flex-col gap-1">
            <div className="bg-blue-500/20 border border-blue-500/40 rounded-full px-2 py-1">
              <span className="text-blue-200 text-xs font-medium">🔒 Private</span>
            </div>
            {document.genre && (
              <div className="bg-gray-500/20 border border-gray-500/40 rounded-full px-2 py-1">
                <span className="text-gray-200 text-xs font-medium">{document.genre}</span>
              </div>
            )}
          </div>
        </div>
        
        <h4 className="font-bold text-lg text-white mb-2 leading-tight line-clamp-2" title={document.title}>
          {document.title}
        </h4>
        <p className="text-sm text-gray-300 mb-3" title={document.author}>
          {document.author || "Personal Document"}
        </p>
        
        {document.description && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-3" title={document.description}>
            {document.description}
          </p>
        )}

        {/* Document metadata */}
        <div className="space-y-1 mb-4">
          {document.filename && (
            <div className="text-xs text-gray-500 font-mono truncate bg-white/5 rounded px-2 py-1 flex items-center gap-2" title={document.filename}>
              <span>📄</span>
              <span className="truncate">{document.filename}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              {document.file_size && (
                <span className="flex items-center gap-1">
                  <span>📏</span>
                  <span>{formatFileSize(document.file_size)}</span>
                </span>
              )}
              {document.created_at && (
                <span className="flex items-center gap-1" title={new Date(document.created_at).toLocaleString()}>
                  <span>📅</span>
                  <span>{new Date(document.created_at).toLocaleDateString()}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document Actions */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            onClick={() => openViewer(document)}
            className="px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg font-medium transition-all duration-300 text-sm flex items-center justify-center gap-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>📖</span>
            <span>View</span>
          </motion.button>
          <motion.button
            onClick={() => handleDownload(document)}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-gray-200 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title="Download Document"
          >
            <span>⬇️</span>
            <span>Download</span>
          </motion.button>
        </div>
        
        <motion.button
          onClick={() => setDeleteConfirm(document)}
          className="w-full px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-200 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>🗑️</span>
          <span>Delete</span>
        </motion.button>
      </div>
    </motion.article>
  );
}