import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Footer({ onSectionChange }) {
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const handleSectionClick = (sectionId) => {
    if (onSectionChange) {
      onSectionChange(sectionId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer 
      style={{
        position: 'relative',
        background: '#000000',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Effects */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {/* Floating Orbs */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: i % 2 === 0 ? '300px' : '200px',
              height: i % 2 === 0 ? '300px' : '200px',
              borderRadius: '50%',
              background: i % 3 === 0 
                ? 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'
                : i % 3 === 1
                ? 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none'
            }}
            animate={{
              x: [
                Math.random() * 100 + '%',
                Math.random() * 100 + '%',
                Math.random() * 100 + '%'
              ],
              y: [
                Math.random() * 100 + '%',
                Math.random() * 100 + '%',
                Math.random() * 100 + '%'
              ],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(102, 126, 234, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(102, 126, 234, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            opacity: 0.5
          }}
        />
      </div>

      {/* Top Animated Border */}
      <motion.div 
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #667eea, #764ba2, #f093fb, transparent)'
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Main Footer Content */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        padding: '100px 40px 40px',
        position: 'relative',
        zIndex: 2
      }}>
        
        {/* Footer Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : window.innerWidth < 1024 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '60px',
          marginBottom: '80px'
        }}>
          
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            style={{ maxWidth: '320px' }}
          >
            <motion.div 
              style={{ marginBottom: '24px', cursor: 'pointer' }}
              onClick={() => handleSectionClick('home')}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                style={{
                  fontSize: '40px',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '8px',
                  letterSpacing: '1px',
                  filter: 'drop-shadow(0 0 20px rgba(102, 126, 234, 0.3))'
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
              <div style={{
                fontSize: '12px',
                color: '#9ca3af',
                fontWeight: '600',
                letterSpacing: '2px'
              }}>
                Digital Library Platform
              </div>
            </motion.div>

            <p style={{ 
              color: '#9ca3af', 
              lineHeight: '1.8', 
              fontSize: '15px',
              marginBottom: '32px',
              fontWeight: '400'
            }}>
              Empowering readers worldwide with cutting-edge document management and AI-powered discovery.
            </p>
            
            {/* Social Links */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { icon: '📧', label: 'Email', color: 'rgba(59, 130, 246, 0.2)' },
                { icon: '🐦', label: 'Twitter', color: 'rgba(139, 92, 246, 0.2)' },
                { icon: '💬', label: 'Discord', color: 'rgba(236, 72, 153, 0.2)' }
              ].map((social, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredSocial(i)}
                  onHoverEnd={() => setHoveredSocial(null)}
                  title={social.label}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    border: hoveredSocial === i 
                      ? '1px solid rgba(102, 126, 234, 0.4)' 
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    background: hoveredSocial === i 
                      ? social.color 
                      : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    transition: 'all 0.3s',
                    backdropFilter: 'blur(10px)',
                    boxShadow: hoveredSocial === i 
                      ? '0 8px 25px rgba(102, 126, 234, 0.3)' 
                      : 'none'
                  }}
                >
                  {social.icon}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 style={{ 
              color: '#ffffff', 
              fontWeight: '800', 
              marginBottom: '28px', 
              fontSize: '18px',
              letterSpacing: '0.5px'
            }}>
              Navigation
            </h4>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px' 
            }}>
              {[
                { name: "Home", id: "home", icon: "🏠" },
                { name: "Public Library", id: "public-library", icon: "🌍" },
                { name: "My Documents", id: "my-documents", icon: "📁" },
                { name: "Upload", id: "upload", icon: "📤" }
              ].map((link, index) => (
                <motion.li 
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <motion.button
                    onClick={() => handleSectionClick(link.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      fontSize: '15px',
                      padding: '0',
                      textAlign: 'left',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                    whileHover={{ 
                      x: 6,
                      color: '#ffffff'
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <span style={{ fontSize: '16px' }}>{link.icon}</span>
                    {link.name}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 style={{ 
              color: '#ffffff', 
              fontWeight: '800', 
              marginBottom: '28px', 
              fontSize: '18px',
              letterSpacing: '0.5px'
            }}>
              Company
            </h4>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px' 
            }}>
              {[
                { name: "About", id: "about" },
                { name: "Contact", id: "contact" },
                { name: "Blog", id: "home" },
                { name: "Careers", id: "home" }
              ].map((link, index) => (
                <motion.li 
                  key={link.id + link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <motion.button
                    onClick={() => handleSectionClick(link.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      fontSize: '15px',
                      padding: '0',
                      textAlign: 'left',
                      fontWeight: '600'
                    }}
                    whileHover={{ 
                      x: 6,
                      color: '#ffffff'
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.name}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 style={{ 
              color: '#ffffff', 
              fontWeight: '800', 
              marginBottom: '28px', 
              fontSize: '18px',
              letterSpacing: '0.5px'
            }}>
              Resources
            </h4>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px' 
            }}>
              {[
                "Documentation",
                "Help Center",
                "API Reference",
                "Community"
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    style={{ 
                      color: '#9ca3af', 
                      fontSize: '15px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                    whileHover={{ 
                      x: 6,
                      color: '#ffffff'
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {item}
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider with Gradient */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.5), rgba(168, 85, 247, 0.5), transparent)',
            marginBottom: '40px',
            transformOrigin: 'left'
          }}
        />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px'
          }}
        >
          <div style={{ 
            color: '#6b7280', 
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>© {new Date().getFullYear()} Readora.</span>
            <span style={{ color: '#9ca3af' }}>Built with 💜</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '32px', 
            fontSize: '14px', 
            flexWrap: 'wrap'
          }}>
            {['Privacy', 'Terms', 'DMCA'].map((text) => (
              <motion.button
                key={text}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#6b7280', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  padding: 0
                }}
                whileHover={{ 
                  color: '#ffffff',
                  y: -2
                }}
              >
                {text}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Back to Top Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            marginTop: '60px',
            textAlign: 'center'
          }}
        >
          <motion.button
            onClick={() => handleSectionClick('home')}
            style={{
              padding: '16px 40px',
              borderRadius: '16px',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              background: 'rgba(102, 126, 234, 0.08)',
              backdropFilter: 'blur(20px)',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              position: 'relative',
              overflow: 'hidden'
            }}
            whileHover={{ 
              y: -6,
              scale: 1.05,
              backgroundColor: 'rgba(102, 126, 234, 0.15)',
              borderColor: 'rgba(102, 126, 234, 0.5)',
              boxShadow: '0 12px 30px rgba(102, 126, 234, 0.3)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)'
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>Back to Top</span>
            <motion.span 
              style={{ 
                fontSize: '20px',
                position: 'relative',
                zIndex: 1
              }}
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ↑
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            marginTop: '80px',
            padding: '60px 40px',
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <motion.h3 
            style={{ 
              fontSize: '32px', 
              fontWeight: '900', 
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              position: 'relative'
            }}
          >
            Stay Updated
          </motion.h3>
          <p style={{ 
            color: '#9ca3af', 
            fontSize: '16px', 
            marginBottom: '32px',
            maxWidth: '500px',
            margin: '0 auto 32px',
            position: 'relative'
          }}>
            Get the latest features, book releases, and updates delivered to your inbox.
          </p>

          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            maxWidth: '500px', 
            margin: '0 auto',
            flexDirection: window.innerWidth < 640 ? 'column' : 'row',
            position: 'relative'
          }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '16px 24px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                color: '#ffffff',
                fontSize: '15px',
                outline: 'none',
                fontWeight: '500'
              }}
            />
            <motion.button
              style={{
                padding: '16px 32px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              Subscribe ✨
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Gradient Glow */}
      <motion.div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '300px',
          background: 'radial-gradient(ellipse at bottom, rgba(102, 126, 234, 0.2) 0%, rgba(168, 85, 247, 0.15) 30%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Bottom Animated Border */}
      <motion.div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #4facfe, #00f2fe)',
          backgroundSize: '200% auto'
        }}
        animate={{
          backgroundPosition: ['0% center', '200% center']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </footer>
  );
}