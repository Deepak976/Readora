import React from "react";
import { motion } from "framer-motion";
import StatsDashboard from "./StatsDashboard";

export default function About({ api, onSectionChange }) {
  const features = [
    {
      icon: "🌍",
      title: "Global Public Library",
      description: "Access thousands of curated public domain books from around the world, legally and freely available to everyone.",
      details: ["Classic literature", "Historical documents", "Academic papers", "Reference materials"],
      gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
      glowColor: "rgba(59, 130, 246, 0.4)"
    },
    {
      icon: "🔒",
      title: "Private Document Storage",
      description: "Upload and organize your personal documents with enterprise-grade security and complete privacy.",
      details: ["100% private storage", "Encrypted files", "Easy organization", "Cross-device access"],
      gradient: "linear-gradient(135deg, #10b981, #34d399)",
      glowColor: "rgba(16, 185, 129, 0.4)"
    },
    {
      icon: "🔍",
      title: "Smart Search & Discovery",
      description: "Find exactly what you're looking for with powerful search across titles, authors, genres, and content.",
      details: ["Full-text search", "Genre filtering", "Author browsing", "Smart suggestions"],
      gradient: "linear-gradient(135deg, #a855f7, #ec4899)",
      glowColor: "rgba(168, 85, 247, 0.4)"
    },
    {
      icon: "📱",
      title: "Modern Reading Experience",
      description: "Read comfortably on any device with our optimized PDF viewer and seamless reading interface.",
      details: ["Responsive design", "Fast loading", "Bookmark support", "Download options"],
      gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
      glowColor: "rgba(245, 158, 11, 0.4)"
    }
  ];

  const stats = [
    { label: "Books Available", value: "100+", icon: "📚", color: "#3b82f6" },
    { label: "Genres", value: "15+", icon: "🏷️", color: "#a855f7" },
    { label: "File Formats", value: "PDF", icon: "📄", color: "#10b981" },
    { label: "Security Level", value: "High", icon: "🔐", color: "#f59e0b" }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Enhanced Background Effects */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        {/* Floating Orbs */}
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

        {/* Visible Grid Pattern */}
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

        {/* Floating Icons */}
        <motion.div
          style={{
            position: 'absolute',
            top: '33%',
            right: '25%',
            fontSize: '64px',
            opacity: 0.15
          }}
          animate={{
            y: [0, -35, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          📚
        </motion.div>
        <motion.div
          style={{
            position: 'absolute',
            bottom: '33%',
            left: '25%',
            fontSize: '80px',
            opacity: 0.15
          }}
          animate={{
            y: [0, -45, 0],
            rotate: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        >
          🚀
        </motion.div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, padding: '80px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '80px' }}
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
              About Readora
            </motion.h1>
            <p style={{
              fontSize: 'clamp(16px, 2.5vw, 24px)',
              color: '#d1d5db',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: 1.6,
              fontWeight: '600'
            }}>
              Reimagining how we access, store, and experience digital literature
            </p>
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '32px',
              padding: '60px 40px',
              marginBottom: '80px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <motion.div 
                style={{ fontSize: '80px', marginBottom: '32px' }}
                animate={{ 
                  scale: [1, 1.15, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                💡
              </motion.div>
              <h2 style={{
                fontSize: '36px',
                fontWeight: '900',
                color: '#ffffff',
                marginBottom: '24px'
              }}>
                Our Vision
              </h2>
              <p style={{
                color: '#d1d5db',
                fontSize: '20px',
                lineHeight: 1.8,
                maxWidth: '900px',
                margin: '0 auto',
                fontWeight: '500'
              }}>
                Readora is built on a simple belief: knowledge should be accessible to everyone. 
                We're creating a platform that combines the world's greatest public domain literature 
                with secure, private document management—all in one beautiful, modern interface. 
                Whether you're exploring classic literature or organizing your personal library, 
                Readora is designed to make reading and document management effortless.
              </p>
            </div>
          </motion.div>

          {/* Key Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ marginBottom: '80px' }}
          >
            <h2 style={{
              fontSize: '48px',
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: '60px',
              textAlign: 'center'
            }}>
              What We Offer
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(2, 1fr)',
              gap: '32px'
            }}>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '28px',
                    padding: '40px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ 
                    y: -10,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: `0 20px 60px ${feature.glowColor}`
                  }}
                >
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
                      <motion.div 
                        style={{
                          fontSize: '56px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '20px',
                          padding: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          boxShadow: `0 8px 25px ${feature.glowColor}`
                        }}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '26px',
                          fontWeight: '900',
                          color: '#ffffff',
                          marginBottom: '16px'
                        }}>
                          {feature.title}
                        </h3>
                        <p style={{
                          color: '#d1d5db',
                          marginBottom: '24px',
                          lineHeight: 1.7,
                          fontSize: '16px',
                          fontWeight: '500'
                        }}>
                          {feature.description}
                        </p>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '10px'
                        }}>
                          {feature.details.map((detail, i) => (
                            <motion.div
                              key={i}
                              style={{
                                fontSize: '14px',
                                color: '#e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '12px',
                                padding: '10px 14px',
                                fontWeight: '600'
                              }}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 + i * 0.05 }}
                            >
                              <span style={{
                                width: '6px',
                                height: '6px',
                                background: feature.gradient,
                                borderRadius: '50%',
                                boxShadow: `0 0 8px ${feature.glowColor}`
                              }} />
                              {detail}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Statistics Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ marginBottom: '80px' }}
          >
            <h2 style={{
              fontSize: '48px',
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: '60px',
              textAlign: 'center'
            }}>
              By The Numbers
            </h2>
            {api ? (
              <StatsDashboard api={api} />
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth < 640 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: '24px'
              }}>
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '24px',
                      padding: '32px 24px',
                      textAlign: 'center',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 300 }}
                    whileHover={{ 
                      y: -8,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      scale: 1.05
                    }}
                  >
                    <motion.div 
                      style={{ fontSize: '48px', marginBottom: '16px' }}
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    >
                      {stat.icon}
                    </motion.div>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: '900',
                      color: stat.color,
                      marginBottom: '8px',
                      textShadow: `0 0 20px ${stat.color}40`
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#9ca3af',
                      fontWeight: '700'
                    }}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Security & Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              marginBottom: '80px',
              maxWidth: '1000px',
              margin: '0 auto 80px'
            }}
          >
            <motion.div 
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '32px',
                padding: '48px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)'
              }}
              whileHover={{ scale: 1.02, y: -8 }}
            >
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{
                  fontSize: '36px',
                  fontWeight: '900',
                  color: '#ffffff',
                  marginBottom: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px'
                }}>
                  <motion.span 
                    style={{
                      fontSize: '48px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      borderRadius: '20px',
                      padding: '16px',
                      boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
                    }}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    🔐
                  </motion.span>
                  Your Privacy Matters
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    "Your documents are completely private and secure",
                    "No tracking or data collection on personal files",
                    "Open-source public domain books, free forever",
                    "Built with modern security best practices",
                    "Your data stays yours, always"
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '16px',
                        padding: '20px 24px'
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ x: 8, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                    >
                      <span style={{
                        color: '#34d399',
                        fontSize: '28px',
                        fontWeight: '900'
                      }}>
                        ✓
                      </span>
                      <span style={{
                        color: '#d1fae5',
                        fontSize: '18px',
                        fontWeight: '700'
                      }}>
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* The Story Behind Readora */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ marginBottom: '80px' }}
          >
            <h2 style={{
              fontSize: '48px',
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: '60px',
              textAlign: 'center'
            }}>
              Our Story
            </h2>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <motion.div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '32px',
                  padding: '60px 48px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <motion.div 
                    style={{
                      fontSize: '96px',
                      marginBottom: '32px',
                      display: 'inline-block',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '50%',
                      padding: '32px',
                      boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
                    }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    🎯
                  </motion.div>
                  <p style={{
                    color: '#d1d5db',
                    fontSize: '18px',
                    lineHeight: 1.8,
                    fontWeight: '500',
                    marginBottom: '24px'
                  }}>
                    Readora was born from a passion for making knowledge accessible. We noticed that while 
                    there are thousands of incredible public domain books available, they're often scattered 
                    across different platforms, difficult to discover, and not optimized for modern reading.
                  </p>
                  <p style={{
                    color: '#d1d5db',
                    fontSize: '18px',
                    lineHeight: 1.8,
                    fontWeight: '500'
                  }}>
                    We set out to change that. Readora combines a beautiful, curated public library with 
                    secure personal document storage—creating a complete reading and organization platform 
                    for the modern age. We're constantly growing, improving, and adding new features to make 
                    your reading experience better every day.
                  </p>
                </div>
                
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }} />
              </motion.div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{
              background: 'rgba(102, 126, 234, 0.08)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '32px',
              padding: '60px 48px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)',
              marginBottom: '80px'
            }}
          >
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{
                fontSize: '40px',
                fontWeight: '900',
                color: '#ffffff',
                marginBottom: '24px'
              }}>
                Start Your Reading Journey
              </h2>
              <p style={{
                color: '#d1d5db',
                fontSize: '18px',
                marginBottom: '40px',
                maxWidth: '700px',
                margin: '0 auto 40px',
                lineHeight: 1.7,
                fontWeight: '500'
              }}>
                Explore our growing collection of public domain classics or upload your personal documents. 
                Everything you need for a modern reading experience, all in one place.
              </p>
              <div style={{
                display: 'flex',
                flexDirection: window.innerWidth < 640 ? 'column' : 'row',
                gap: '20px',
                justifyContent: 'center'
              }}>
                <motion.button
                  onClick={() => onSectionChange && onSectionChange('public-library')}
                  style={{
                    padding: '18px 40px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '18px',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '18px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: '0 12px 30px rgba(102, 126, 234, 0.4)'
                  }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span style={{ fontSize: '24px' }}>🌍</span>
                  <span>Explore Library</span>
                </motion.button>
                <motion.button
                  onClick={() => onSectionChange && onSectionChange('upload')}
                  style={{
                    padding: '18px 40px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '18px',
                    color: '#ffffff',
                    fontSize: '18px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                  }}
                  whileHover={{ scale: 1.05, y: -3, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span style={{ fontSize: '24px' }}>📤</span>
                  <span>Upload Documents</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Version & Legal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{
              marginTop: '80px',
              paddingTop: '40px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}
          >
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '24px 32px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <p style={{
                color: '#9ca3af',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '700'
              }}>
                Readora • Making knowledge accessible to everyone
              </p>
              <p style={{
                color: '#6b7280',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                All public domain books are legally free to access and distribute
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}