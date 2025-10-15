import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// DOCUMENT COVER PLACEHOLDER COMPONENT
// ============================================================================
function DocumentCoverPlaceholder({ title, filename }) {
  const initial = title ? title.charAt(0).toUpperCase() : filename ? filename.charAt(0).toUpperCase() : 'D';
  
  const gradients = [
    'from-blue-500 to-cyan-600',
    'from-purple-500 to-pink-600',
    'from-green-500 to-emerald-600',
    'from-orange-500 to-red-600',
    'from-indigo-500 to-purple-600',
    'from-teal-500 to-blue-600'
  ];
  
  const charCode = initial.charCodeAt(0);
  const gradient = gradients[charCode % gradients.length];

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
          width: '100px',
          height: '100px',
          border: '3px solid white',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '120px',
          height: '120px',
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
        <div style={{
          fontSize: '72px',
          fontWeight: 'bold',
          marginBottom: '12px',
          opacity: 0.9,
          textShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          {initial}
        </div>

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
          PERSONAL
        </div>

        <div style={{ padding: '0 12px', width: '100%' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            lineHeight: '1.3',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {title}
          </div>
        </div>
      </div>

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
// DOCUMENT CARD COMPONENT
// ============================================================================
function DocumentCard({ document, index, openViewer, handleDownload, setDeleteConfirm }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
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
            <DocumentCoverPlaceholder 
              title={document.title}
              filename={document.filename}
            />
            
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(16, 185, 129, 0.9)',
              border: '1px solid rgba(16, 185, 129, 0.5)',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: '50px',
              fontSize: '10px',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                background: '#ffffff',
                borderRadius: '50%',
                boxShadow: '0 0 6px #ffffff'
              }} />
              Private
            </div>
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
            {document.title}
          </h3>
          <p style={{ fontSize: '14px', color: '#a78bfa', marginBottom: '12px', fontWeight: '600' }}>
            {document.author || 'Personal Document'}
          </p>
          
          {document.filename && (
            <div style={{
              fontSize: '11px',
              color: '#9ca3af',
              fontFamily: 'monospace',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '6px 10px',
              marginBottom: '12px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }} title={document.filename}>
              📄 {document.filename}
            </div>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#6b7280',
            fontWeight: '600',
            marginBottom: '16px'
          }}>
            {document.file_size && (
              <span>💾 {formatFileSize(document.file_size)}</span>
            )}
            {document.created_at && (
              <span title={new Date(document.created_at).toLocaleString()}>
                📅 {new Date(document.created_at).toLocaleDateString()}
              </span>
            )}
          </div>
          
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <motion.button
                onClick={() => openViewer(document)}
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: '#ffffff',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                📖 Read
              </motion.button>
              
              <motion.button
                onClick={() => handleDownload(document)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#d1d5db',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
                whileHover={{ scale: 1.02, y: -2, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                whileTap={{ scale: 0.98 }}
              >
                ⬇️ Save
              </motion.button>
            </div>
            
            <motion.button
              onClick={() => setDeleteConfirm(document)}
              style={{
                width: '100%',
                background: 'rgba(220, 38, 38, 0.15)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                color: '#fca5a5',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
              whileHover={{ scale: 1.02, y: -2, backgroundColor: 'rgba(220, 38, 38, 0.25)' }}
              whileTap={{ scale: 0.98 }}
            >
              🗑️ Delete
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// LIST VIEW COMPONENT
// ============================================================================
function DocumentListItem({ document, index, openViewer, handleDownload, setDeleteConfirm }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.03 }}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '20px 24px'
      }}
      whileHover={{ 
        scale: 1.01,
        x: 6,
        backgroundColor: 'rgba(102, 126, 234, 0.08)',
        borderColor: 'rgba(102, 126, 234, 0.3)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
          <motion.div 
            style={{
              width: '56px',
              height: '70px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '28px',
              flexShrink: 0,
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}
            whileHover={{ scale: 1.05 }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 60%)'
            }} />
            <span style={{ position: 'relative', zIndex: 1 }}>📄</span>
          </motion.div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{
              fontWeight: '800',
              color: '#ffffff',
              fontSize: '18px',
              marginBottom: '8px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {document.title}
            </h4>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '13px',
              color: '#9ca3af',
              fontWeight: '600',
              flexWrap: 'wrap'
            }}>
              <span style={{ color: '#a78bfa' }}>{document.author || "Personal Document"}</span>
              {document.file_size && <span>💾 {formatFileSize(document.file_size)}</span>}
              {document.created_at && <span>📅 {new Date(document.created_at).toLocaleDateString()}</span>}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <motion.button
            onClick={() => openViewer(document)}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#ffffff',
              borderRadius: '12px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📖 Read
          </motion.button>
          <motion.button
            onClick={() => handleDownload(document)}
            style={{
              padding: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#d1d5db',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '18px'
            }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            whileTap={{ scale: 0.95 }}
            title="Download"
          >
            ⬇️
          </motion.button>
          <motion.button
            onClick={() => setDeleteConfirm(document)}
            style={{
              padding: '10px',
              background: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              color: '#fca5a5',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '18px'
            }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(220, 38, 38, 0.25)' }}
            whileTap={{ scale: 0.95 }}
            title="Delete"
          >
            🗑️
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN MY DOCUMENTS COMPONENT
// ============================================================================
export default function MyDocuments({ openViewer, handleDownload, setDeleteConfirm, onSectionChange, api }) {
  const [userDocuments, setUserDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    loadUserDocuments();
    
    const handleRefresh = () => {
      loadUserDocuments();
    };

    window.addEventListener('refreshBooks', handleRefresh);

    return () => {
      window.removeEventListener('refreshBooks', handleRefresh);
    };
  }, [api]);

  const loadUserDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${api}/books`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const allBooks = await res.json();
      const userDocs = allBooks.filter(book => 
        book.is_public !== true && 
        book.source !== 'Sample Data' && 
        book.library_type !== 'public' &&
        book.filename
      );
      
      setUserDocuments(userDocs || []);
    } catch (e) {
      console.error("loadUserDocuments error:", e);
      setError(`Could not load your documents. ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = userDocuments.filter(doc => {
      if (!searchQuery) return true;
      
      return doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.author && doc.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.filename && doc.filename.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    switch (sortBy) {
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "author":
        filtered.sort((a, b) => (a.author || "").localeCompare(b.author || ""));
        break;
      case "size":
        filtered.sort((a, b) => (b.file_size || 0) - (a.file_size || 0));
        break;
      case "recent":
      default:
        filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        break;
    }

    return filtered;
  }, [userDocuments, searchQuery, sortBy]);

  const fileStats = useMemo(() => {
    const stats = { total: userDocuments.length, totalSize: 0 };
    userDocuments.forEach(doc => {
      stats.totalSize += doc.file_size || 0;
    });
    return stats;
  }, [userDocuments]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Enhanced Background Effects */}
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
              scale: [1, 1.3, 1],
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

      <div style={{ position: 'relative', zIndex: 10, padding: '80px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <motion.h1 
              style={{
                fontSize: 'clamp(48px, 10vw, 96px)',
                fontWeight: '900',
                marginBottom: '24px',
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
              My Documents
            </motion.h1>
            <p style={{
              fontSize: 'clamp(16px, 2.5vw, 24px)',
              color: '#d1d5db',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: 1.6,
              fontWeight: '600',
              marginBottom: '60px'
            }}>
              Your personal document library — completely private and secure
            </p>

            {/* Stats Cards */}
            {fileStats.total > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: window.innerWidth < 640 ? '1fr' : 'repeat(3, 1fr)',
                  gap: '24px',
                  maxWidth: '900px',
                  margin: '0 auto'
                }}
              >
                {[
                  { 
                    icon: "📄", 
                    value: fileStats.total, 
                    label: "Documents",
                    gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
                  },
                  { 
                    icon: "💾", 
                    value: `${(fileStats.totalSize / (1024 * 1024)).toFixed(1)}MB`, 
                    label: "Total Size",
                    gradient: 'linear-gradient(135deg, #a855f7, #ec4899)'
                  },
                  { 
                    icon: "🔒", 
                    value: "Private", 
                    label: "Security",
                    gradient: 'linear-gradient(135deg, #10b981, #34d399)'
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '24px',
                      padding: '32px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center'
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, type: "spring", stiffness: 300 }}
                    whileHover={{ 
                      y: -8,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      scale: 1.05
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>{stat.icon}</div>
                    <div style={{
                      fontSize: '36px',
                      fontWeight: '900',
                      background: stat.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '8px'
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '700' }}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Search & Controls */}
            {userDocuments.length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <div style={{
                  display: 'flex',
                  flexDirection: window.innerWidth < 1024 ? 'column' : 'row',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  {/* Search Bar */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      borderRadius: '20px',
                      padding: '16px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <span style={{ fontSize: '20px' }}>🔍</span>
                      <input
                        type="text"
                        placeholder="Search your documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          flex: 1,
                          background: 'transparent',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '16px',
                          fontWeight: '600',
                          outline: 'none'
                        }}
                      />
                      {searchQuery && (
                        <motion.button
                          onClick={() => setSearchQuery("")}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          whileHover={{ scale: 1.1, backgroundColor: 'rgba(220, 38, 38, 0.2)' }}
                          whileTap={{ scale: 0.9 }}
                        >
                          ✕
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Sort & View Controls */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{
                        padding: '16px 20px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '16px',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '700',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="recent" style={{ background: '#1a1a1a' }}>Recently Added</option>
                      <option value="title" style={{ background: '#1a1a1a' }}>Title A-Z</option>
                      <option value="author" style={{ background: '#1a1a1a' }}>Author A-Z</option>
                      <option value="size" style={{ background: '#1a1a1a' }}>File Size</option>
                    </select>
                    
                    <div style={{
                      display: 'flex',
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '16px',
                      padding: '4px'
                    }}>
                      <motion.button
                        onClick={() => setViewMode('grid')}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          border: 'none',
                          background: viewMode === 'grid' ? 'rgba(102, 126, 234, 0.3)' : 'transparent',
                          color: viewMode === 'grid' ? '#ffffff' : '#9ca3af',
                          cursor: 'pointer',
                          fontSize: '20px'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ▦
                      </motion.button>
                      <motion.button
                        onClick={() => setViewMode('list')}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          border: 'none',
                          background: viewMode === 'list' ? 'rgba(102, 126, 234, 0.3)' : 'transparent',
                          color: viewMode === 'list' ? '#ffffff' : '#9ca3af',
                          cursor: 'pointer',
                          fontSize: '20px'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        ☰
                      </motion.button>
                    </div>

                    <motion.button
                      onClick={() => onSectionChange && onSectionChange('upload')}
                      style={{
                        padding: '12px 24px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '14px',
                        color: '#34d399',
                        fontSize: '14px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        whiteSpace: 'nowrap'
                      }}
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(16, 185, 129, 0.25)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>📤</span> Upload
                    </motion.button>
                  </div>
                </div>

                {/* Search Results Summary */}
                {searchQuery && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '16px',
                      padding: '16px 20px'
                    }}
                  >
                    <div style={{ color: '#93c5fd', fontSize: '14px', fontWeight: '600' }}>
                      {filteredAndSortedDocuments.length === 0 
                        ? `No documents found for "${searchQuery}"` 
                        : `Found ${filteredAndSortedDocuments.length} document${filteredAndSortedDocuments.length === 1 ? '' : 's'} matching "${searchQuery}"`}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Content Display */}
            <div style={{ minHeight: '400px' }}>
              {/* Loading */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '80px 0'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{
                        width: '64px',
                        height: '64px',
                        border: '4px solid rgba(102, 126, 234, 0.2)',
                        borderTopColor: '#667eea',
                        borderRadius: '50%',
                        margin: '0 auto 24px'
                      }}
                    />
                    <p style={{ color: '#ffffff', fontWeight: '800', fontSize: '20px' }}>
                      Loading your documents...
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Empty State */}
              {!loading && userDocuments.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '80px 24px' }}
                >
                  <motion.div 
                    style={{ fontSize: '120px', marginBottom: '32px' }}
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    📚
                  </motion.div>
                  <h3 style={{ fontSize: '36px', fontWeight: '900', color: '#ffffff', marginBottom: '16px' }}>
                    Your library awaits
                  </h3>
                  <p style={{
                    color: '#d1d5db',
                    marginBottom: '40px',
                    maxWidth: '600px',
                    margin: '0 auto 40px',
                    fontSize: '18px',
                    lineHeight: 1.6
                  }}>
                    Start building your personal library by uploading your first PDF document
                  </p>
                  {onSectionChange && (
                    <motion.button
                      onClick={() => onSectionChange('upload')}
                      style={{
                        padding: '18px 40px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        borderRadius: '20px',
                        color: '#ffffff',
                        fontSize: '18px',
                        fontWeight: '800',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)'
                      }}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span style={{ fontSize: '24px' }}>📤</span>
                      Upload Your First Document
                    </motion.button>
                  )}
                </motion.div>
              )}

              {/* Empty Search */}
              {!loading && userDocuments.length > 0 && filteredAndSortedDocuments.length === 0 && searchQuery && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: 'center', padding: '80px 0' }}
                >
                  <div style={{ fontSize: '96px', marginBottom: '24px' }}>🔍</div>
                  <h3 style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff', marginBottom: '16px' }}>
                    No matching documents
                  </h3>
                  <p style={{ color: '#d1d5db', marginBottom: '32px', fontSize: '16px' }}>
                    Try different search terms
                  </p>
                  <motion.button
                    onClick={() => setSearchQuery("")}
                    style={{
                      padding: '14px 32px',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      borderRadius: '16px',
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: '800',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear Search
                  </motion.button>
                </motion.div>
              )}

              {/* Documents Grid/List */}
              {!loading && filteredAndSortedDocuments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {viewMode === 'grid' ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: window.innerWidth < 640 ? '1fr' : window.innerWidth < 1024 ? 'repeat(2, 1fr)' : window.innerWidth < 1280 ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
                      gap: '24px'
                    }}>
                      <AnimatePresence>
                        {filteredAndSortedDocuments.map((document, index) => (
                          <DocumentCard
                            key={document.id}
                            document={document}
                            index={index}
                            openViewer={openViewer}
                            handleDownload={handleDownload}
                            setDeleteConfirm={setDeleteConfirm}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <AnimatePresence>
                        {filteredAndSortedDocuments.map((document, index) => (
                          <DocumentListItem
                            key={document.id}
                            document={document}
                            index={index}
                            openViewer={openViewer}
                            handleDownload={handleDownload}
                            setDeleteConfirm={setDeleteConfirm}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}