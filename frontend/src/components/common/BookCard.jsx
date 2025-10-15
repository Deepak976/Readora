// frontend/src/components/common/BookCard.jsx - WITH BOOK COVERS!
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function BookCard({ book, index, openViewer, handleDownload, isPublic = true }) {
  const [imageError, setImageError] = useState(false);
  const isFeatured = book.is_featured || book.featured;
  const hasCover = book.cover_url && !imageError;
  
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-700/30 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      {/* Book Cover Image */}
      <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600">
        {hasCover ? (
          <motion.img
            src={book.cover_url}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
            <motion.div
              className="text-6xl mb-4"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              📚
            </motion.div>
            <div className="text-white text-center">
              <h5 className="font-bold text-lg line-clamp-2 mb-2">{book.title}</h5>
              <p className="text-sm text-white/80 line-clamp-1">{book.author || "Unknown Author"}</p>
            </div>
          </div>
        )}
        
        {/* Overlay gradient for better text readability on image */}
        {hasCover && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        )}
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {isFeatured && (
            <motion.div 
              className="bg-amber-500/90 backdrop-blur-sm border border-amber-400/50 rounded-full px-3 py-1.5 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <span className="text-white text-xs font-bold flex items-center gap-1">
                <span>⭐</span>
                <span>Featured</span>
              </span>
            </motion.div>
          )}
          {isPublic && (
            <motion.div 
              className="bg-green-500/90 backdrop-blur-sm border border-green-400/50 rounded-full px-3 py-1.5 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <span className="text-white text-xs font-bold flex items-center gap-1">
                <span>🌍</span>
                <span>Public</span>
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Book Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title and Author */}
        <div className="mb-4">
          <h4 className="font-bold text-xl text-white mb-2 leading-tight line-clamp-2" title={book.title}>
            {book.title}
          </h4>
          <p className="text-sm text-indigo-300 font-medium" title={book.author}>
            {book.author || "Unknown Author"}
          </p>
        </div>
        
        {/* Genre Badge */}
        {book.genre && (
          <div className="mb-3">
            <span className="inline-block bg-purple-500/20 border border-purple-500/40 rounded-full px-3 py-1.5 text-purple-200 text-xs font-semibold">
              {book.genre}
            </span>
          </div>
        )}
        
        {/* Description */}
        {book.description && (
          <p className="text-sm text-indigo-400 mb-4 line-clamp-3 leading-relaxed" title={book.description}>
            {book.description}
          </p>
        )}

        {/* Book Metadata */}
        <div className="space-y-2 mb-4 flex-grow">
          {book.copyright_status && book.copyright_status !== 'unknown' && (
            <div className="text-xs text-green-400 flex items-center gap-2 bg-green-500/10 rounded-lg px-3 py-1.5">
              <span className="text-base">📜</span>
              <span className="font-semibold">{book.copyright_status}</span>
            </div>
          )}
          
          {book.publication_year && (
            <div className="text-xs text-blue-400 flex items-center gap-2 bg-blue-500/10 rounded-lg px-3 py-1.5">
              <span className="text-base">📅</span>
              <span className="font-semibold">Published: {book.publication_year}</span>
            </div>
          )}
          
          {book.language && book.language !== 'en' && (
            <div className="text-xs text-cyan-400 flex items-center gap-2 bg-cyan-500/10 rounded-lg px-3 py-1.5">
              <span className="text-base">🌐</span>
              <span className="font-semibold">{book.language.toUpperCase()}</span>
            </div>
          )}
          
          {(book.view_count > 0 || book.download_count > 0) && (
            <div className="text-xs text-gray-400 flex items-center gap-3 bg-white/5 rounded-lg px-3 py-1.5">
              {book.view_count > 0 && (
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className="text-base">👁️</span>
                  <span>{book.view_count.toLocaleString()}</span>
                </span>
              )}
              {book.view_count > 0 && book.download_count > 0 && (
                <span className="text-gray-600">•</span>
              )}
              {book.download_count > 0 && (
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className="text-base">⬇️</span>
                  <span>{book.download_count.toLocaleString()}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Filename (if available) */}
        {book.filename && (
          <div className="text-xs text-indigo-500 font-mono truncate bg-white/5 rounded-lg px-3 py-2 mb-3" title={book.filename}>
            <span className="text-indigo-400">📄</span> {book.filename}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <motion.button
            onClick={() => openViewer(book)}
            className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-300 text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg">📖</span>
            <span>Read Now</span>
          </motion.button>
          
          <motion.button
            onClick={() => handleDownload(book)}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 text-gray-200 hover:text-white rounded-xl font-bold transition-all duration-300 text-sm flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            title="Download PDF"
          >
            <span className="text-lg">⬇️</span>
            <span>Download</span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}