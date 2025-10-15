import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Home({ onSectionChange, api }) {
  const [stats, setStats] = useState({});
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  useEffect(() => {
    loadHomeData();
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [api]);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      
      const mockBooks = [
        {
          id: 1,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          genre: "Classic Literature",
          description: "A masterpiece of American literature",
          is_featured: true,
          is_public: true,
          source: "Sample Data",
          cover: "🎭",
          color: "from-blue-500 to-cyan-500"
        },
        {
          id: 2,
          title: "Pride and Prejudice", 
          author: "Jane Austen",
          genre: "Romance",
          description: "A timeless romance",
          is_featured: true,
          is_public: true,
          source: "Sample Data",
          cover: "💕",
          color: "from-pink-500 to-rose-500"
        },
        {
          id: 3,
          title: "1984",
          author: "George Orwell",
          genre: "Dystopian",
          description: "A chilling vision of the future",
          is_featured: true,
          is_public: true,
          source: "Sample Data",
          cover: "👁️",
          color: "from-purple-500 to-indigo-500"
        }
      ];

      const publicBooks = mockBooks.filter(book => 
        book.is_public === true || book.source === 'Sample Data'
      );

      const featured = publicBooks.filter(book => book.is_featured === true).slice(0, 6);
      setFeaturedBooks(featured);

      setStats({
        total_books: 0,
        public_library_books: 0,
        user_documents: 0,
        available_genres: []
      });
    } catch (error) {
      console.error("Error loading home data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: '#000000',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Dynamic Gradient Background */}
      <motion.div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.15) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.15) 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Mesh Grid */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          opacity: 0.4,
          pointerEvents: 'none'
        }}
      />

      {/* Cursor Glow Effect */}
      <motion.div
        style={{
          position: 'fixed',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1,
          left: mousePosition.x - 300,
          top: mousePosition.y - 300,
          filter: 'blur(60px)'
        }}
      />

      {/* Floating Orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'fixed',
            width: i % 2 === 0 ? '400px' : '300px',
            height: i % 2 === 0 ? '400px' : '300px',
            borderRadius: '50%',
            background: i % 3 === 0 
              ? 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)'
              : i % 3 === 1
              ? 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight
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

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* Hero Section */}
        <motion.section 
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 24px',
            scale: heroScale,
            opacity: heroOpacity
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', width: '100%' }}>
            
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                borderRadius: '50px',
                marginBottom: '40px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
            >
              <motion.div 
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 20px #10b981'
                }}
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [1, 0.6, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '0.5px' }}>
                ✨ The Future of Digital Reading is Here
              </span>
            </motion.div>

            {/* Main Hero Title */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.6, 0.05, 0.01, 0.9] }}
              style={{ marginBottom: '40px' }}
            >
              <motion.h1 
                style={{
                  fontSize: 'clamp(48px, 10vw, 120px)',
                  fontWeight: '900',
                  lineHeight: '1.1',
                  marginBottom: '24px',
                  letterSpacing: '-2px'
                }}
              >
                <motion.span 
                  style={{
                    display: 'block',
                    marginBottom: '16px',
                    color: '#ffffff',
                    textShadow: '0 2px 40px rgba(255, 255, 255, 0.2)'
                  }}
                  animate={{
                    textShadow: [
                      '0 2px 40px rgba(255, 255, 255, 0.2)',
                      '0 2px 60px rgba(255, 255, 255, 0.3)',
                      '0 2px 40px rgba(255, 255, 255, 0.2)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Welcome to
                </motion.span>
                <motion.span 
                  style={{
                    display: 'block',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
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
                  READORA
                </motion.span>
              </motion.h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              style={{
                fontSize: 'clamp(18px, 3vw, 28px)',
                maxWidth: '900px',
                margin: '0 auto 60px',
                lineHeight: '1.6',
                color: '#e5e7eb'
              }}
            >
              Transform your reading experience with{" "}
              <span style={{ 
                fontWeight: '800',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                AI-powered
              </span>
              {" "}document management — Upload, organize, and discover with lightning speed
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              style={{
                display: 'flex',
                flexDirection: window.innerWidth < 640 ? 'column' : 'row',
                gap: '20px',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '80px'
              }}
            >
              <motion.button
                onClick={() => onSectionChange('public-library')}
                style={{
                  position: 'relative',
                  padding: '18px 40px',
                  fontSize: '18px',
                  fontWeight: '800',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: '#ffffff',
                  boxShadow: '0 20px 50px rgba(102, 126, 234, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  overflow: 'hidden'
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -4,
                  boxShadow: '0 25px 60px rgba(102, 126, 234, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)'
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  📚 Explore Library
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>

              <motion.button
                onClick={() => onSectionChange('upload')}
                style={{
                  padding: '18px 40px',
                  fontSize: '18px',
                  fontWeight: '800',
                  borderRadius: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  color: '#ffffff',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -4,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                📤 Upload Documents
              </motion.button>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: '16px',
                maxWidth: '900px',
                margin: '0 auto'
              }}
            >
              {[
                { icon: "🛡️", text: "Secure", gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
                { icon: "⚡", text: "Fast", gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
                { icon: "🧠", text: "Smart AI", gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
                { icon: "☁️", text: "Cloud", gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '24px 16px',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ 
                    y: -8,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <motion.div
                    style={{ fontSize: '36px', filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.3))' }}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {item.icon}
                  </motion.div>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section style={{ padding: '120px 24px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: 'center', marginBottom: '80px' }}
            >
              <h2 style={{ 
                fontSize: 'clamp(40px, 8vw, 72px)',
                fontWeight: '900',
                marginBottom: '20px',
                background: 'linear-gradient(135deg, #ffffff, #e5e7eb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Powerful Features
              </h2>
              <p style={{ fontSize: '20px', color: '#9ca3af' }}>
                Everything you need for the perfect reading experience
              </p>
            </motion.div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : 'repeat(3, 1fr)',
              gap: '32px'
            }}>
              {[
                {
                  icon: "🚀",
                  title: "Lightning Search",
                  description: "Find any document instantly with AI-powered search that understands context",
                  features: ["Instant Results", "Smart Filters", "Preview Mode", "Multi-Format"],
                  gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                  glowColor: 'rgba(59, 130, 246, 0.4)'
                },
                {
                  icon: "🛡️", 
                  title: "Fort Knox Security",
                  description: "Military-grade encryption ensures your library stays completely private",
                  features: ["End-to-End Encryption", "Zero Knowledge", "Local First", "GDPR Ready"],
                  gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  glowColor: 'rgba(168, 85, 247, 0.4)'
                },
                {
                  icon: "🎯",
                  title: "Smart Organization",
                  description: "AI automatically categorizes and tracks your reading journey",
                  features: ["Auto-Tags", "Progress Sync", "Reading Stats", "Collections"],
                  gradient: 'linear-gradient(135deg, #10b981, #34d399)',
                  glowColor: 'rgba(16, 185, 129, 0.4)'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <motion.div
                    style={{
                      padding: '40px',
                      borderRadius: '24px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    whileHover={{ 
                      y: -12, 
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      boxShadow: `0 20px 60px ${feature.glowColor}`
                    }}
                  >
                    {/* Top gradient line */}
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: feature.gradient,
                        opacity: 0
                      }}
                      whileHover={{ opacity: 1 }}
                    />
                    
                    <motion.div
                      style={{ fontSize: '72px', marginBottom: '24px' }}
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {feature.icon}
                    </motion.div>
                    
                    <h3 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '16px' }}>
                      {feature.title}
                    </h3>
                    
                    <p style={{ marginBottom: '32px', lineHeight: '1.6', color: '#d1d5db', fontSize: '16px' }}>
                      {feature.description}
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {feature.features.map((item, i) => (
                        <motion.div 
                          key={i}
                          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <div 
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: feature.gradient,
                              boxShadow: `0 0 12px ${feature.glowColor}`
                            }}
                          />
                          <span style={{ fontSize: '14px', color: '#e5e7eb', fontWeight: '600' }}>{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Books */}
        {!loading && featuredBooks.length > 0 && (
          <section style={{ padding: '120px 24px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                style={{ textAlign: 'center', marginBottom: '80px' }}
              >
                <h2 style={{ 
                  fontSize: 'clamp(40px, 8vw, 72px)',
                  fontWeight: '900',
                  marginBottom: '20px',
                  background: 'linear-gradient(135deg, #ffffff, #e5e7eb)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Classic Collection
                </h2>
                <p style={{ fontSize: '20px', color: '#9ca3af' }}>
                  Start with these timeless masterpieces
                </p>
              </motion.div>

              <div style={{ 
                display: 'grid',
                gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
                gap: '32px',
                marginBottom: '60px'
              }}>
                {featuredBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.15, duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                    onClick={() => onSectionChange('public-library')}
                    style={{ cursor: 'pointer' }}
                  >
                    <motion.div
                      style={{
                        padding: '32px',
                        borderRadius: '24px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                        height: '100%',
                        textAlign: 'center'
                      }}
                      whileHover={{ 
                        y: -12, 
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
                      }}
                    >
                      <motion.div
                        style={{
                          width: '120px',
                          height: '160px',
                          margin: '0 auto 32px',
                          borderRadius: '16px',
                          background: index === 0 
                            ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
                            : index === 1
                            ? 'linear-gradient(135deg, #ec4899, #f43f5e)'
                            : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '56px',
                          boxShadow: index === 0
                            ? '0 20px 50px rgba(59, 130, 246, 0.4)'
                            : index === 1
                            ? '0 20px 50px rgba(236, 72, 153, 0.4)'
                            : '0 20px 50px rgba(139, 92, 246, 0.4)'
                        }}
                        whileHover={{ scale: 1.1, rotateY: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {book.cover || "📚"}
                      </motion.div>

                      <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>
                        {book.title}
                      </h3>
                      
                      <p style={{ color: '#9ca3af', marginBottom: '20px', fontSize: '16px' }}>
                        by {book.author}
                      </p>
                      
                      <span 
                        style={{
                          display: 'inline-block',
                          padding: '8px 20px',
                          borderRadius: '50px',
                          fontSize: '12px',
                          fontWeight: '700',
                          background: 'rgba(59, 130, 246, 0.15)',
                          color: '#60a5fa',
                          border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}
                      >
                        {book.genre}
                      </span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{ textAlign: 'center' }}
              >
                <motion.button
                  onClick={() => onSectionChange('public-library')}
                  style={{
                    padding: '18px 48px',
                    fontSize: '18px',
                    fontWeight: '800',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: '#ffffff',
                    boxShadow: '0 20px 50px rgba(102, 126, 234, 0.4)'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -4,
                    boxShadow: '0 25px 60px rgba(102, 126, 234, 0.5)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  📖 View Full Library
                </motion.button>
              </motion.div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section style={{ padding: '120px 24px 100px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 style={{ 
                fontSize: 'clamp(40px, 8vw, 72px)',
                fontWeight: '900',
                marginBottom: '32px',
                lineHeight: '1.2',
                background: 'linear-gradient(135deg, #ffffff, #e5e7eb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Ready to Start?
              </h2>
              
              <p style={{ fontSize: '24px', marginBottom: '60px', color: '#d1d5db' }}>
                Join thousands discovering their next favorite book
              </p>
              
              <div style={{ 
                display: 'flex',
                flexDirection: window.innerWidth < 640 ? 'column' : 'row',
                gap: '24px',
                justifyContent: 'center'
              }}>
                <motion.button
                  onClick={() => onSectionChange('public-library')}
                  style={{
                    padding: '20px 50px',
                    fontSize: '20px',
                    fontWeight: '900',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    background: '#ffffff',
                    color: '#000000',
                    boxShadow: '0 20px 50px rgba(255, 255, 255, 0.3)'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -4,
                    boxShadow: '0 25px 60px rgba(255, 255, 255, 0.4)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  🚀 Get Started
                </motion.button>
                
                <motion.button
                  onClick={() => onSectionChange('about')}
                  style={{
                    padding: '20px 50px',
                    fontSize: '20px',
                    fontWeight: '900',
                    borderRadius: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    color: '#ffffff',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.3)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
}