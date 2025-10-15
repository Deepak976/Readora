import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Header({ 
  activeSection, 
  onSectionChange, 
  showAdminPanel, 
  setShowAdminPanel,
  isAdmin
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.4, 0.7]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: '🏠', gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(6, 182, 212, 0.9))', shadow: 'rgba(59, 130, 246, 0.4)' },
    { id: 'public-library', label: 'Library', icon: '🌍', gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(20, 184, 166, 0.9))', shadow: 'rgba(16, 185, 129, 0.4)' },
    { id: 'my-documents', label: 'Documents', icon: '📁', gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.9), rgba(236, 72, 153, 0.9))', shadow: 'rgba(168, 85, 247, 0.4)' },
    { id: 'upload', label: 'Upload', icon: '📤', gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.9), rgba(239, 68, 68, 0.9))', shadow: 'rgba(249, 115, 22, 0.4)' },
    { id: 'about', label: 'About', icon: 'ℹ️', gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.9))', shadow: 'rgba(99, 102, 241, 0.4)' },
    { id: 'contact', label: 'Contact', icon: '📧', gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.9), rgba(244, 63, 94, 0.9))', shadow: 'rgba(236, 72, 153, 0.4)' }
  ];

  return (
    <motion.header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled 
          ? 'rgba(0, 0, 0, 0.6)' 
          : 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.3s ease'
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
    >
      {/* Animated Background Gradient */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div style={{
        maxWidth: '1500px',
        margin: '0 auto',
        padding: '16px 40px',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        minHeight: '85px',
        position: 'relative'
      }}>
        {/* Ultra-Modern Logo - LEFT */}
        <motion.div 
          style={{
            cursor: 'pointer',
            position: 'relative',
            justifySelf: 'start'
          }}
          onClick={() => onSectionChange('home')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.div
            style={{
              position: 'relative',
              display: 'inline-block'
            }}
          >
            {/* Glowing Background */}
            <motion.div
              style={{
                position: 'absolute',
                inset: '-10px',
                background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
                filter: 'blur(20px)',
                opacity: 0,
                borderRadius: '20px'
              }}
              animate={{
                opacity: [0, 0.3, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div 
              style={{
                position: 'relative',
                fontSize: '42px',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '3px',
                filter: 'drop-shadow(0 0 30px rgba(102, 126, 234, 0.5))',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
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
              READORA
            </motion.div>
            
            <motion.div 
              style={{
                fontSize: '11px',
                color: '#a0aec0',
                fontWeight: '600',
                letterSpacing: '3px',
                marginTop: '4px',
                textTransform: 'uppercase',
                opacity: 0.8
              }}
              animate={{
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ✨ Next-Gen Library
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Premium Navigation Pills - CENTER */}
        <motion.nav 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(16px)',
            borderRadius: '60px',
            padding: '6px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            justifySelf: 'center'
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
        >
          {/* Shine Effect */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            }}
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeInOut"
            }}
          />

          {navigationItems.map((item, index) => {
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                style={{
                  position: 'relative',
                  padding: '14px 22px',
                  borderRadius: '50px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: isActive 
                    ? item.gradient 
                    : 'transparent',
                  color: isActive ? '#ffffff' : '#cbd5e0',
                  fontSize: '14px',
                  fontWeight: '700',
                  boxShadow: isActive 
                    ? `0 10px 30px ${item.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.2)` 
                    : 'none',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                whileHover={{ 
                  scale: 1.08,
                  y: -3,
                }}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 + 0.4 }}
              >
                {/* Hover Glow Effect */}
                {isActive && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}

                <motion.span 
                  style={{ 
                    fontSize: '18px',
                    filter: isActive ? 'drop-shadow(0 2px 8px rgba(255, 255, 255, 0.5))' : 'none'
                  }}
                  animate={isActive ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  } : {}}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  {item.icon}
                </motion.span>
                <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>
              </motion.button>
            );
          })}
        </motion.nav>

        {/* Premium Admin Button - RIGHT (or invisible spacer when not admin) */}
        <div style={{ justifySelf: 'end' }}>
          {isAdmin ? (
            <motion.button
              onClick={() => setShowAdminPanel(!showAdminPanel)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 26px',
                border: showAdminPanel 
                  ? '1px solid rgba(168, 85, 247, 0.5)' 
                  : '1px solid rgba(168, 85, 247, 0.2)',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                background: showAdminPanel 
                  ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(139, 92, 246, 0.3))' 
                  : 'rgba(168, 85, 247, 0.08)',
                color: '#ffffff',
                backdropFilter: 'blur(12px)',
                boxShadow: showAdminPanel 
                  ? '0 10px 30px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              whileHover={{ 
                scale: 1.08,
                y: -3,
                borderColor: 'rgba(168, 85, 247, 0.6)'
              }}
              whileTap={{ scale: 0.96 }}
            >
              {/* Animated Background */}
              {showAdminPanel && (
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(139, 92, 246, 0.2))',
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}

              <motion.span 
                style={{ 
                  fontSize: '18px',
                  position: 'relative',
                  zIndex: 1,
                  filter: showAdminPanel ? 'drop-shadow(0 2px 8px rgba(168, 85, 247, 0.6))' : 'none'
                }}
                animate={{
                  rotate: showAdminPanel ? [0, 180] : 0
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.6, 0.05, 0.01, 0.9]
                }}
              >
                ⚙️
              </motion.span>
              <span style={{ position: 'relative', zIndex: 1 }}>Admin</span>
              
              {/* Pulse Ring */}
              {showAdminPanel && (
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: -2,
                    border: '2px solid rgba(168, 85, 247, 0.5)',
                    borderRadius: '50px',
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 0, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.button>
          ) : (
            // Invisible spacer to maintain layout symmetry
            <div style={{ width: '130px' }} />
          )}
        </div>
      </div>

      {/* Multi-Layer Animated Border */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', overflow: 'hidden' }}>
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, #667eea, #764ba2, #f093fb, #4facfe, transparent)',
          }}
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
            opacity: 0.5
          }}
          animate={{
            x: ['100%', '-100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Floating Particles Effect */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'rgba(102, 126, 234, 0.6)',
            boxShadow: '0 0 10px rgba(102, 126, 234, 0.8)',
          }}
          animate={{
            x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
            y: [-20, 120],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.header>
  );
}