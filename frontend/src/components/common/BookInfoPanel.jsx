// frontend/src/components/common/BookInfoPanel.jsx
import React from "react";
import { motion } from "framer-motion";

export default function BookInfoPanel({ book }) {
  if (!book) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">📖</div>
        <div className="text-gray-400">No book information available</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return null;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return null;
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isPublic = book.is_public === true || book.library_type === 'public';
  const isPersonal = !isPublic;

  return (
    <div className="space-y-6">
      {/* Book Cover & Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 w-20 h-26 rounded-lg flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
          {isPersonal ? '📄' : '📖'}
        </div>
        <h3 className="text-lg font-bold text-white mb-2 leading-tight">{book.title}</h3>
        {book.author && (
          <p className="text-indigo-300 text-sm">{book.author}</p>
        )}
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">{isPublic ? '🌍' : '🔒'}</div>
          <div className="text-xs text-gray-300">{isPublic ? 'Public' : 'Private'}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl mb-1">📄</div>
          <div className="text-xs text-gray-300">PDF</div>
        </div>
      </motion.div>

      {/* Genre */}
      {book.genre && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Genre</h4>
          <div className="bg-purple-500/20 border border-purple-500/40 rounded-lg px-3 py-2">
            <span className="text-purple-200 text-sm">{book.genre}</span>
          </div>
        </motion.div>
      )}

      {/* Description */}
      {book.description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Description</h4>
          <div className="bg-white/5 rounded-lg p-3">
            <p className="text-gray-300 text-sm leading-relaxed">{book.description}</p>
          </div>
        </motion.div>
      )}

      {/* Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Details</h4>
        <div className="space-y-3 text-sm">
          {/* Copyright Status */}
          {book.copyright_status && (
            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400">Copyright:</span>
              <span className={`text-sm px-2 py-1 rounded ${
                book.copyright_status === 'Public Domain' ? 'bg-green-500/20 text-green-300' :
                book.copyright_status === 'Creative Commons' ? 'bg-blue-500/20 text-blue-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {book.copyright_status}
              </span>
            </div>
          )}

          {/* Language */}
          {book.language && (
            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400">Language:</span>
              <span className="text-blue-300 flex items-center gap-1">
                <span>🌐</span>
                <span>{book.language.toUpperCase()}</span>
              </span>
            </div>
          )}

          {/* File Size */}
          {book.file_size && (
            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400">File Size:</span>
              <span className="text-indigo-300">{formatFileSize(book.file_size)}</span>
            </div>
          )}

          {/* Upload Date */}
          {book.created_at && (
            <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
              <span className="text-gray-400">{isPersonal ? 'Uploaded:' : 'Added:'}</span>
              <span className="text-indigo-300">{formatDate(book.created_at)}</span>
            </div>
          )}

          {/* View/Download Count */}
          {(book.view_count > 0 || book.download_count > 0) && (
            <div className="pt-2">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-2">Statistics</div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  {book.view_count > 0 && (
                    <div>
                      <div className="text-lg font-semibold text-white">{book.view_count}</div>
                      <div className="text-xs text-indigo-300">Views</div>
                    </div>
                  )}
                  {book.download_count > 0 && (
                    <div>
                      <div className="text-lg font-semibold text-white">{book.download_count}</div>
                      <div className="text-xs text-indigo-300">Downloads</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Featured Badge */}
      {(book.is_featured || book.featured) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-400 text-lg">⭐</span>
            <span className="text-amber-200 text-sm font-medium">Featured Book</span>
          </div>
          <p className="text-amber-100 text-xs leading-relaxed">
            This book is featured in our curated collection and highlighted on the homepage
          </p>
        </motion.div>
      )}

      {/* File Information */}
      {book.filename && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h4 className="text-sm font-semibold text-gray-300 mb-2">File Info</h4>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Filename</div>
            <p className="text-gray-300 text-xs font-mono break-all">{book.filename}</p>
          </div>
        </motion.div>
      )}

      {/* Reading Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-lg p-3"
      >
        <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <span>💡</span>
          Reading Tips
        </h4>
        <div className="text-xs text-indigo-200 space-y-1">
          <div>• Use <kbd className="bg-gray-700 px-1 rounded">F</kbd> for fullscreen mode</div>
          <div>• Use <kbd className="bg-gray-700 px-1 rounded">+/-</kbd> to zoom in/out</div>
          <div>• Press <kbd className="bg-gray-700 px-1 rounded">Esc</kbd> to close viewer</div>
          <div>• Click "New Tab" to open in browser</div>
        </div>
      </motion.div>

      {/* Privacy Notice for Personal Documents */}
      {isPersonal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-400 text-lg">🔒</span>
            <span className="text-blue-200 text-sm font-medium">Private Document</span>
          </div>
          <p className="text-blue-100 text-xs leading-relaxed">
            This document is private and only accessible by you. We never access or share your personal files.
          </p>
        </motion.div>
      )}
    </div>
  );
}