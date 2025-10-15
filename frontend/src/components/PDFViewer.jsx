import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookInfoPanel from "./common/BookInfoPanel";

export default function PDFViewer({ url, onClose, book }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1.0);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);

  // Auto-hide controls after inactivity
  useEffect(() => {
    let timeout;
    const resetTimeout = () => {
      if (timeout) clearTimeout(timeout);
      setShowControls(true);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    const handleMouseMove = () => resetTimeout();
    window.addEventListener('mousemove', handleMouseMove);
    resetTimeout();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  // Loading timeout
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "f" || e.key === "F") setIsFullscreen((s) => !s);
      if (e.key === "i" || e.key === "I") setShowInfo((s) => !s);
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(3, s + 0.25));
      if (e.key === "-") setScale((s) => Math.max(0.5, s - 0.25));
      if (e.key === "0") setScale(1.0);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const containerClass = isFullscreen 
    ? "w-screen h-screen rounded-none" 
    : "w-[95vw] h-[95vh] rounded-3xl";

  return (
    <motion.div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={containerClass}
        style={{
          background: '#000000',
          boxShadow: '0 25px 100px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(102, 126, 234, 0.3)',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Background Grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(102, 126, 234, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102, 126, 234, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.5,
          pointerEvents: 'none'
        }} />

        {/* Floating Orbs Background */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: i % 2 === 0 
                ? 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
              zIndex: 0
            }}
            animate={{
              x: [
                Math.random() * 100 + '%',
                Math.random() * 100 + '%'
              ],
              y: [
                Math.random() * 100 + '%',
                Math.random() * 100 + '%'
              ],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Floating Header Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                right: '20px',
                zIndex: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap'
              }}
            >
              {/* Left Side - Book Info */}
              <motion.div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '16px 24px',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
                whileHover={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  borderColor: 'rgba(102, 126, 234, 0.5)'
                }}
              >
                <motion.div 
                  style={{
                    width: '56px',
                    height: '56px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '28px',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  📖
                </motion.div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontWeight: '800',
                    color: '#ffffff',
                    fontSize: '18px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '400px'
                  }} title={book?.title}>
                    {book?.title || "Document"}
                  </div>
                  <div style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '600' }}>
                    {book?.author || "Unknown Author"}
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {/* Zoom Controls */}
                <motion.div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    padding: '6px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                  }}
                  whileHover={{ borderColor: 'rgba(102, 126, 234, 0.5)' }}
                >
                  <motion.button
                    onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '14px',
                      color: '#ffffff',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '20px',
                      fontWeight: '900'
                    }}
                    whileHover={{ 
                      backgroundColor: 'rgba(102, 126, 234, 0.2)',
                      scale: 1.1
                    }}
                    whileTap={{ scale: 0.95 }}
                    title="Zoom Out (-)"
                  >
                    −
                  </motion.button>
                  <div style={{
                    fontSize: '14px',
                    color: '#ffffff',
                    minWidth: '70px',
                    textAlign: 'center',
                    padding: '0 12px',
                    fontWeight: '800'
                  }}>
                    {Math.round(scale * 100)}%
                  </div>
                  <motion.button
                    onClick={() => setScale((s) => Math.min(3, s + 0.25))}
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '14px',
                      color: '#ffffff',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '20px',
                      fontWeight: '900'
                    }}
                    whileHover={{ 
                      backgroundColor: 'rgba(102, 126, 234, 0.2)',
                      scale: 1.1
                    }}
                    whileTap={{ scale: 0.95 }}
                    title="Zoom In (+)"
                  >
                    +
                  </motion.button>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    padding: '6px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                  }}
                  whileHover={{ borderColor: 'rgba(102, 126, 234, 0.5)' }}
                >
                  <motion.button
                    onClick={() => setScale(1.0)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '14px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '800',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer'
                    }}
                    whileHover={{ 
                      backgroundColor: 'rgba(102, 126, 234, 0.2)',
                      scale: 1.05
                    }}
                    whileTap={{ scale: 0.95 }}
                    title="Reset Zoom (0)"
                  >
                    Reset
                  </motion.button>

                  <motion.button
                    onClick={() => setShowInfo((s) => !s)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '14px',
                      fontSize: '14px',
                      fontWeight: '800',
                      border: 'none',
                      cursor: 'pointer',
                      background: showInfo 
                        ? 'linear-gradient(135deg, #667eea, #764ba2)'
                        : 'transparent',
                      color: '#ffffff',
                      boxShadow: showInfo ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none'
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: showInfo ? undefined : 'rgba(102, 126, 234, 0.2)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    title="Toggle Info Panel (I)"
                  >
                    Info
                  </motion.button>

                  <motion.button
                    onClick={() => setIsFullscreen((f) => !f)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '14px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '800',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer'
                    }}
                    whileHover={{ 
                      backgroundColor: 'rgba(102, 126, 234, 0.2)',
                      scale: 1.05
                    }}
                    whileTap={{ scale: 0.95 }}
                    title={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
                  >
                    {isFullscreen ? "⊗" : "⛶"}
                  </motion.button>

                  <motion.a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      borderRadius: '14px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '800',
                      textDecoration: 'none',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-block'
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    title="Open in New Tab"
                  >
                    ↗ New Tab
                  </motion.a>

                  <motion.button
                    onClick={onClose}
                    style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                      borderRadius: '14px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '800',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)'
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 6px 20px rgba(220, 38, 38, 0.5)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    title="Close (Esc)"
                  >
                    ✕ Close
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div style={{ display: 'flex', height: '100%', position: 'relative', zIndex: 1 }}>
          {/* PDF Viewer */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <div style={{
              width: '100%',
              height: '100%',
              overflow: 'auto',
              background: '#0a0a0a',
              position: 'relative'
            }}>
              {/* PDF Frame */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100%',
                padding: '32px',
                paddingTop: '120px',
                paddingBottom: '80px'
              }}>
                <motion.div
                  style={{
                    width: '100%',
                    maxWidth: '1200px',
                    transformOrigin: 'center top'
                  }}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: scale, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div style={{ position: 'relative' }}>
                    {/* PDF Glow Effect */}
                    <motion.div 
                      style={{
                        position: 'absolute',
                        inset: '-20px',
                        background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
                        borderRadius: '32px',
                        filter: 'blur(30px)',
                        opacity: 0.5,
                        pointerEvents: 'none'
                      }}
                      animate={{
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* PDF Container */}
                    <div style={{
                      position: 'relative',
                      background: '#ffffff',
                      borderRadius: '24px',
                      boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
                      overflow: 'hidden',
                      border: '1px solid rgba(102, 126, 234, 0.3)'
                    }}>
                      <iframe
                        src={url}
                        title="PDF Preview"
                        style={{
                          width: '100%',
                          height: '80vh',
                          border: 'none',
                          background: '#ffffff'
                        }}
                        onLoad={() => setIsLoading(false)}
                      />
                    </div>

                    {/* Floating Zoom Indicator */}
                    <AnimatePresence>
                      {scale !== 1.0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(0, 0, 0, 0.9)',
                            backdropFilter: 'blur(10px)',
                            color: '#ffffff',
                            padding: '8px 16px',
                            borderRadius: '50px',
                            fontSize: '14px',
                            fontWeight: '800',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
                          }}
                        >
                          {Math.round(scale * 100)}%
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Info Panel Sidebar */}
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  width: '400px',
                  background: 'rgba(0, 0, 0, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderLeft: '1px solid rgba(102, 126, 234, 0.3)',
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Decorative Background */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle at top right, rgba(102, 126, 234, 0.1) 0%, transparent 50%)',
                  pointerEvents: 'none'
                }} />
                
                <div style={{
                  position: 'relative',
                  zIndex: 10,
                  padding: '32px',
                  overflowY: 'auto',
                  height: '100%'
                }}>
                  <div style={{ marginBottom: '32px', paddingTop: '80px' }}>
                    <h3 style={{
                      fontSize: '28px',
                      fontWeight: '900',
                      color: '#ffffff',
                      marginBottom: '12px'
                    }}>
                      Book Details
                    </h3>
                    <div style={{
                      width: '60px',
                      height: '4px',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      borderRadius: '4px'
                    }} />
                  </div>
                  <BookInfoPanel book={book} />
                </div>

                {/* Close Info Panel Button */}
                <motion.button
                  onClick={() => setShowInfo(false)}
                  style={{
                    position: 'absolute',
                    top: '24px',
                    right: '24px',
                    width: '48px',
                    height: '48px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '50%',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '20px',
                    fontWeight: '900'
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 90,
                    backgroundColor: 'rgba(220, 38, 38, 0.2)',
                    borderColor: 'rgba(220, 38, 38, 0.5)'
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Keyboard Shortcuts Hint */}
        <AnimatePresence>
          {showControls && !isFullscreen && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 20
              }}
            >
              <div style={{
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '16px 32px',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  fontSize: '13px',
                  color: '#9ca3af',
                  fontWeight: '600'
                }}>
                  {[
                    { key: 'Esc', label: 'Close' },
                    { key: 'F', label: 'Fullscreen' },
                    { key: '+/−', label: 'Zoom' },
                    { key: 'I', label: 'Info' },
                    { key: '0', label: 'Reset' }
                  ].map((shortcut, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <kbd style={{
                        background: 'rgba(102, 126, 234, 0.2)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: '800',
                        fontFamily: 'monospace'
                      }}>
                        {shortcut.key}
                      </kbd>
                      <span>{shortcut.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 30
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: '80px',
                    height: '80px',
                    border: '4px solid rgba(102, 126, 234, 0.2)',
                    borderTopColor: '#667eea',
                    borderRadius: '50%',
                    margin: '0 auto 32px'
                  }}
                />
                <motion.div
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                  style={{
                    color: '#ffffff',
                    fontWeight: '900',
                    fontSize: '28px',
                    marginBottom: '12px'
                  }}
                >
                  Loading PDF...
                </motion.div>
                <div style={{ color: '#9ca3af', fontSize: '16px', fontWeight: '600' }}>
                  Preparing your reading experience
                </div>
                
                {/* Loading Progress Bar */}
                <div style={{
                  width: '320px',
                  height: '6px',
                  background: 'rgba(102, 126, 234, 0.2)',
                  borderRadius: '10px',
                  margin: '32px auto 0',
                  overflow: 'hidden'
                }}>
                  <motion.div
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #667eea, #764ba2)',
                      borderRadius: '10px'
                    }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}