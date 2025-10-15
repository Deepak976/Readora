import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// BOOK COVER PLACEHOLDER COMPONENT
// ============================================================================
function BookCoverPlaceholder({ title, author, genre }) {
  const genreColors = {
    'Philosophy': 'from-purple-500 to-indigo-600',
    'Psychology': 'from-blue-500 to-cyan-600',
    'Business & Strategy': 'from-green-500 to-emerald-600',
    'Science': 'from-teal-500 to-blue-600',
    'Mythology': 'from-amber-500 to-orange-600',
    'Biography': 'from-rose-500 to-pink-600',
    'Political Philosophy': 'from-red-500 to-rose-600',
    'Economics': 'from-indigo-500 to-purple-600',
    'Poetry': 'from-fuchsia-500 to-pink-600',
    'Classic Literature': 'from-yellow-500 to-orange-600',
    'Fiction': 'from-violet-500 to-purple-600',
    'Mystery': 'from-slate-600 to-gray-700',
    'Horror': 'from-red-600 to-black',
    'Adventure': 'from-lime-500 to-green-600',
    'Fantasy': 'from-purple-600 to-fuchsia-600',
    'Science Fiction': 'from-cyan-500 to-blue-700',
    'Romance': 'from-pink-400 to-rose-500',
    'Drama': 'from-red-400 to-pink-500',
    'Comedy': 'from-yellow-400 to-orange-500',
    'Historical Fiction': 'from-amber-600 to-yellow-700',
    'Children': 'from-sky-400 to-blue-500',
    'default': 'from-gray-500 to-slate-600'
  };

  const gradient = genreColors[genre] || genreColors['default'];
  const initial = title ? title.charAt(0).toUpperCase() : 'B';

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}
    className={`bg-gradient-to-br ${gradient}`}>
      {/* Decorative pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.1
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '120px',
          height: '120px',
          border: '3px solid white',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '150px',
          height: '150px',
          border: '3px solid white',
          borderRadius: '50%',
          transform: 'translate(50%, 50%)'
        }}></div>
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'white',
        textAlign: 'center'
      }}>
        {/* Large initial */}
        <div style={{
          fontSize: '72px',
          fontWeight: 'bold',
          marginBottom: '12px',
          opacity: 0.9,
          textShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          {initial}
        </div>

        {/* Genre badge */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          padding: '6px 16px',
          borderRadius: '50px',
          fontSize: '10px',
          fontWeight: '700',
          letterSpacing: '0.05em',
          marginBottom: '16px'
        }}>
          {genre || 'CLASSIC'}
        </div>

        {/* Title (truncated) */}
        <div style={{ padding: '0 12px', width: '100%' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            lineHeight: '1.3',
            marginBottom: '4px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {title}
          </div>
          {author && (
            <div style={{
              fontSize: '9px',
              opacity: 0.8,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {author}
            </div>
          )}
        </div>
      </div>

      {/* Book spine effect */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '6px',
        background: 'rgba(0, 0, 0, 0.2)'
      }}></div>
    </div>
  );
}

// ============================================================================
// BOOK VIEWER MODAL
// ============================================================================
function BookViewerModal({ book, isOpen, onClose, onDownload, onStartReading, isAdmin = false, handleDeleteBook, deletingBookId }) {
  if (!isOpen || !book) return null;

  return (
    <AnimatePresence>
      <motion.div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
            backdropFilter: 'blur(24px)',
            borderRadius: '32px',
            padding: '48px',
            maxWidth: '1000px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(102, 126, 234, 0.3)'
          }}
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <motion.button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              width: '48px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '24px',
              cursor: 'pointer'
            }}
            whileHover={{ 
              scale: 1.1,
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              borderColor: 'rgba(239, 68, 68, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            ✕
          </motion.button>

          <div style={{ display: 'flex', gap: '40px', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
            <div style={{ flexShrink: 0 }}>
              <motion.div
                style={{
                  width: '240px',
                  height: '320px',
                  borderRadius: '20px',
                  boxShadow: '0 25px 60px rgba(102, 126, 234, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {book.cover_url ? (
                  <img 
                    src={book.cover_url}
                    alt={book.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <BookCoverPlaceholder 
                    title={book.title}
                    author={book.author}
                    genre={book.genre}
                  />
                )}
              </motion.div>
            </div>

            <div style={{ flex: 1, overflow: 'auto' }}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 style={{ fontSize: '40px', fontWeight: '900', color: '#ffffff', marginBottom: '16px', lineHeight: 1.2 }}>
                  {book.title}
                </h1>
                <p style={{ fontSize: '24px', color: '#a78bfa', marginBottom: '24px', fontWeight: '600' }}>
                  {book.author || "Unknown Author"}
                </p>
                
                {book.genre && (
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: 'rgba(168, 85, 247, 0.2)',
                      color: '#c4b5fd',
                      padding: '8px 20px',
                      borderRadius: '50px',
                      fontSize: '14px',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      fontWeight: '700'
                    }}>
                      {book.genre}
                    </span>
                    {book.copyright_status && (
                      <span style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#93c5fd',
                        padding: '8px 20px',
                        borderRadius: '50px',
                        fontSize: '14px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        fontWeight: '700'
                      }}>
                        {book.copyright_status}
                      </span>
                    )}
                  </div>
                )}

                {book.description && (
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', marginBottom: '12px' }}>
                      Description
                    </h3>
                    <p style={{ color: '#d1d5db', lineHeight: 1.8, fontSize: '16px' }}>
                      {book.description}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <motion.button
                    onClick={() => onStartReading(book)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: '#ffffff',
                      padding: '18px 32px',
                      borderRadius: '16px',
                      border: 'none',
                      fontSize: '18px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    📖 Start Reading
                  </motion.button>
                  
                  <motion.button
                    onClick={() => onDownload(book)}
                    style={{
                      padding: '18px 32px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '16px',
                      fontSize: '18px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -2,
                      backgroundColor: 'rgba(255, 255, 255, 0.15)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ⬇️
                  </motion.button>
                </div>

                {/* ONLY SHOW DELETE BUTTON FOR ADMIN */}
                {isAdmin && (
                  <motion.div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <motion.button
                      onClick={(e) => handleDeleteBook(book, e)}
                      disabled={deletingBookId === book.id}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                        color: '#ffffff',
                        padding: '18px 32px',
                        borderRadius: '16px',
                        border: 'none',
                        fontSize: '18px',
                        fontWeight: '800',
                        cursor: deletingBookId === book.id ? 'not-allowed' : 'pointer',
                        opacity: deletingBookId === book.id ? 0.6 : 1
                      }}
                      whileHover={deletingBookId !== book.id ? { scale: 1.02, y: -2 } : {}}
                      whileTap={deletingBookId !== book.id ? { scale: 0.98 } : {}}
                    >
                      {deletingBookId === book.id ? '🔄 Deleting...' : '🗑️ Delete Book'}
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================================
// MAIN PUBLIC LIBRARY COMPONENT
// ============================================================================
export default function PublicLibrary({ openViewer, handleDownload, api, onSectionChange, isAdmin = false }) {
  const [publicBooks, setPublicBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [deletingBookId, setDeletingBookId] = useState(null);
  const [viewMode, setViewMode] = useState("genres");

  useEffect(() => {
    const fetchPublicBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = api?.baseURL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/books/public?limit=100`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch books: ${response.statusText}`);
        }
        
        const books = await response.json();
        setPublicBooks(Array.isArray(books) ? books : []);
      } catch (err) {
        console.error('Error fetching public books:', err);
        setError(err.message);
        setPublicBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicBooks();
  }, [api]);

  const genreIcons = {
    "Drama": "🎭",
    "Comedy": "😄",
    "Fiction": "📖",
    "Classic Literature": "📚",
    "Mystery": "🔍",
    "Horror": "💀",
    "Adventure": "🗺️",
    "Fantasy": "🧙",
    "Science Fiction": "🚀",
    "Historical Fiction": "🏛️",
    "Romance": "💕",
    "Self-Help": "🌟",
    "Children": "🧒",
    "Biography": "👤",
    "Philosophy": "💭",
    "Psychology": "🧠",
    "Business & Strategy": "💼",
    "Science": "🔬",
    "Mythology": "⚡",
    "Political Philosophy": "🏛️",
    "Economics": "📈",
    "Poetry": "✍️"
  };

  const booksByGenre = useMemo(() => {
    const grouped = {};
    publicBooks.forEach(book => {
      const genre = book.genre || 'Uncategorized';
      if (!grouped[genre]) {
        grouped[genre] = [];
      }
      grouped[genre].push(book);
    });
    return grouped;
  }, [publicBooks]);

  const availableGenres = useMemo(() => {
    return Object.keys(booksByGenre).sort();
  }, [booksByGenre]);

  const filteredAndSortedBooks = useMemo(() => {
    return publicBooks.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (book.description && book.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (book.genre && book.genre.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
      
      return matchesSearch && matchesGenre;
    });
  }, [publicBooks, searchQuery, selectedGenre]);

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setShowBookModal(true);
  };

  const handleStartReading = (book) => {
    setShowBookModal(false);
    if (openViewer) {
      openViewer(book);
    }
  };

  const handleDeleteBook = async (book, event) => {
    if (event) event.stopPropagation();

    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete "${book.title}"?\n\nThis action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    try {
      setDeletingBookId(book.id);
      
      const apiUrl = api?.baseURL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/books/${book.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete book: ${response.statusText}`);
      }

      setPublicBooks(prevBooks => prevBooks.filter(b => b.id !== book.id));
      
      if (selectedBook && selectedBook.id === book.id) {
        setShowBookModal(false);
        setSelectedBook(null);
      }

      alert(`"${book.title}" has been deleted successfully.`);
      
    } catch (error) {
      console.error('Error deleting book:', error);
      alert(`Failed to delete book: ${error.message}`);
    } finally {
      setDeletingBookId(null);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000'
      }}>
        <div style={{ textAlign: 'center' }}>
          <motion.div
            style={{
              width: '80px',
              height: '80px',
              border: '4px solid rgba(102, 126, 234, 0.2)',
              borderTopColor: '#667eea',
              borderRadius: '50%',
              margin: '0 auto 32px'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p style={{ color: '#ffffff', fontSize: '24px', fontWeight: '600' }}>
            Loading library...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
        padding: '24px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <div style={{ fontSize: '120px', marginBottom: '32px' }}>⚠️</div>
          <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#ffffff', marginBottom: '16px' }}>
            Connection Error
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '18px', marginBottom: '32px' }}>
            Unable to load the library. Please check your connection.
          </p>
          <motion.button
            onClick={() => window.location.reload()}
            style={{
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '16px',
              fontSize: '18px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#000000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effects */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: i % 2 === 0 ? '400px' : '300px',
              height: i % 2 === 0 ? '400px' : '300px',
              borderRadius: '50%',
              background: i % 3 === 0 
                ? 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)'
                : i % 3 === 1
                ? 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none'
            }}
            animate={{
              x: [
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)
              ],
              y: [
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
              ],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(102, 126, 234, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102, 126, 234, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.6
        }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Hero Section */}
        <section style={{ padding: '120px 24px 60px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              style={{ textAlign: 'center', marginBottom: '60px' }}
            >
              <motion.h1 
                style={{
                  fontSize: 'clamp(48px, 10vw, 96px)',
                  fontWeight: '900',
                  marginBottom: '32px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 60px rgba(102, 126, 234, 0.5))'
                }}
                animate={{
                  backgroundPosition: ['0% center', '200% center']
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Public Library
              </motion.h1>
              <p style={{
                fontSize: 'clamp(18px, 3vw, 28px)',
                color: '#d1d5db',
                maxWidth: '900px',
                margin: '0 auto 40px',
                lineHeight: 1.6
              }}>
                Discover {publicBooks.length}+ books across {availableGenres.length} diverse genres
              </p>

              {/* View Mode Toggle */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px' }}>
                <motion.button
                  onClick={() => setViewMode("genres")}
                  style={{
                    padding: '14px 32px',
                    borderRadius: '50px',
                    border: viewMode === "genres" ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                    background: viewMode === "genres"
                      ? 'linear-gradient(135deg, #667eea, #764ba2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: viewMode === "genres" ? '0 8px 25px rgba(102, 126, 234, 0.4)' : 'none'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📚 Browse by Genre
                </motion.button>
                <motion.button
                  onClick={() => setViewMode("grid")}
                  style={{
                    padding: '14px 32px',
                    borderRadius: '50px',
                    border: viewMode === "grid" ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                    background: viewMode === "grid"
                      ? 'linear-gradient(135deg, #667eea, #764ba2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: viewMode === "grid" ? '0 8px 25px rgba(102, 126, 234, 0.4)' : 'none'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎯 View All Books
                </motion.button>
              </div>

              {/* Search Bar */}
              {viewMode === "grid" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ maxWidth: '700px', margin: '0 auto' }}
                >
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '24px',
                    padding: '12px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <span style={{ fontSize: '24px' }}>🔍</span>
                    <input
                      type="text"
                      placeholder="Search books..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '18px',
                        fontWeight: '600',
                        outline: 'none'
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* GENRE SECTIONS VIEW */}
        {viewMode === "genres" ? (
          <section style={{ padding: '40px 24px 100px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              {availableGenres.map((genre, genreIndex) => {
                const genreBooks = booksByGenre[genre];
                const icon = genreIcons[genre] || "📖";
                
                return (
                  <motion.div
                    key={genre}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: genreIndex * 0.1 }}
                    style={{ marginBottom: '80px' }}
                  >
                    {/* Genre Header */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '20px', 
                      marginBottom: '32px',
                      paddingBottom: '16px',
                      borderBottom: '2px solid rgba(102, 126, 234, 0.3)'
                    }}>
                      <div style={{
                        fontSize: '48px',
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)'
                      }}>
                        {icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h2 style={{ 
                          fontSize: '36px', 
                          fontWeight: '900', 
                          color: '#ffffff',
                          marginBottom: '8px'
                        }}>
                          {genre}
                        </h2>
                        <p style={{ fontSize: '18px', color: '#9ca3af', fontWeight: '600' }}>
                          {genreBooks.length} {genreBooks.length === 1 ? 'book' : 'books'} available
                        </p>
                      </div>
                    </div>

                    {/* Genre Books Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: window.innerWidth < 640 ? '1fr' : window.innerWidth < 1024 ? 'repeat(2, 1fr)' : window.innerWidth < 1280 ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
                      gap: '24px'
                    }}>
                      {genreBooks.map((book, bookIndex) => (
                        <BookCard
                          key={book.id}
                          book={book}
                          bookIndex={bookIndex}
                          handleBookClick={handleBookClick}
                          isAdmin={isAdmin}
                          handleDeleteBook={handleDeleteBook}
                          deletingBookId={deletingBookId}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ) : (
          /* GRID VIEW (All Books) */
          <section style={{ padding: '40px 24px 100px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              {/* Genre Filter */}
              {availableGenres.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '12px'
                  }}>
                    <motion.button
                      onClick={() => setSelectedGenre("all")}
                      style={{
                        padding: '12px 28px',
                        borderRadius: '50px',
                        border: selectedGenre === "all" ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                        background: selectedGenre === "all"
                          ? 'linear-gradient(135deg, #667eea, #764ba2)'
                          : 'rgba(255, 255, 255, 0.05)',
                        color: '#ffffff',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      All ({publicBooks.length})
                    </motion.button>
                    {availableGenres.map((genre) => (
                      <motion.button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        style={{
                          padding: '12px 28px',
                          borderRadius: '50px',
                          border: selectedGenre === genre ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                          background: selectedGenre === genre
                            ? 'linear-gradient(135deg, #667eea, #764ba2)'
                            : 'rgba(255, 255, 255, 0.05)',
                          color: '#ffffff',
                          fontSize: '15px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {genreIcons[genre] || "📖"} {genre} ({booksByGenre[genre].length})
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Books Grid */}
              {filteredAndSortedBooks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                  <div style={{ fontSize: '120px', marginBottom: '32px' }}>🔍</div>
                  <h3 style={{ fontSize: '36px', fontWeight: '900', color: '#ffffff', marginBottom: '16px' }}>
                    No books found
                  </h3>
                  <p style={{ color: '#9ca3af', fontSize: '18px' }}>
                    Try a different search or filter
                  </p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: window.innerWidth < 640 ? '1fr' : window.innerWidth < 1024 ? 'repeat(2, 1fr)' : window.innerWidth < 1280 ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
                  gap: '32px'
                }}>
                  {filteredAndSortedBooks.map((book, index) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      bookIndex={index}
                      handleBookClick={handleBookClick}
                      isAdmin={isAdmin}
                      handleDeleteBook={handleDeleteBook}
                      deletingBookId={deletingBookId}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      <BookViewerModal
        book={selectedBook}
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
        onDownload={handleDownload}
        onStartReading={handleStartReading}
        isAdmin={isAdmin}
        handleDeleteBook={handleDeleteBook}
        deletingBookId={deletingBookId}
      />
    </div>
  );
}

// ============================================================================
// BOOK CARD COMPONENT
// ============================================================================
function BookCard({ book, bookIndex, handleBookClick, isAdmin, handleDeleteBook, deletingBookId }) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: bookIndex * 0.05, duration: 0.5 }}
      onClick={() => handleBookClick(book)}
      style={{ cursor: 'pointer' }}
    >
      <motion.div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '20px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
        whileHover={{
          y: -8,
          backgroundColor: 'rgba(102, 126, 234, 0.08)',
          borderColor: 'rgba(102, 126, 234, 0.3)',
          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)'
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <motion.div
            style={{
              width: '100%',
              height: '240px',
              borderRadius: '12px',
              boxShadow: '0 12px 30px rgba(102, 126, 234, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            whileHover={{ scale: 1.03 }}
          >
            {book.cover_url && !imageError ? (
              <img 
                src={book.cover_url}
                alt={book.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={() => setImageError(true)}
              />
            ) : (
              <BookCoverPlaceholder 
                title={book.title}
                author={book.author}
                genre={book.genre}
              />
            )}
            
            {(book.is_featured || book.featured) && (
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '50px',
                fontSize: '10px',
                fontWeight: '800'
              }}>
                ⭐ Featured
              </div>
            )}
            
            {/* ONLY SHOW DELETE BUTTON FOR ADMIN */}
            {isAdmin && (
              <motion.button
                onClick={(e) => handleDeleteBook(book, e)}
                disabled={deletingBookId === book.id}
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  width: '32px',
                  height: '32px',
                  background: 'rgba(220, 38, 38, 0.9)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '16px',
                  cursor: deletingBookId === book.id ? 'not-allowed' : 'pointer',
                  opacity: deletingBookId === book.id ? 0.6 : 1
                }}
                whileHover={deletingBookId !== book.id ? { scale: 1.1 } : {}}
                whileTap={deletingBookId !== book.id ? { scale: 0.9 } : {}}
              >
                {deletingBookId === book.id ? '⏳' : '×'}
              </motion.button>
            )}
          </motion.div>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{
            fontSize: '17px',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '6px',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {book.title}
          </h3>
          <p style={{ fontSize: '14px', color: '#a78bfa', marginBottom: '12px', fontWeight: '600' }}>
            {book.author || 'Unknown Author'}
          </p>
          
          {book.genre && (
            <span style={{
              background: 'rgba(168, 85, 247, 0.2)',
              color: '#c4b5fd',
              padding: '4px 12px',
              borderRadius: '50px',
              fontSize: '11px',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              fontWeight: '700',
              display: 'inline-block',
              marginBottom: '12px',
              width: 'fit-content'
            }}>
              {book.genre}
            </span>
          )}
          
          <div style={{ marginTop: 'auto' }}>
            <motion.button
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: '#ffffff',
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              📖 Read Now
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}