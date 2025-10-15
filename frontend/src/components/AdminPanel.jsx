import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPanel({ onClose, api }) {
  const [stats, setStats] = useState({
    totalBooks: 0,
    genres: 0,
    featured: 0,
    storageUsed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const apiUrl = api?.baseURL || api || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/books/public?limit=1000`);
      
      if (response.ok) {
        const books = await response.json();
        
        // Calculate stats
        const genresSet = new Set(books.map(book => book.genre).filter(Boolean));
        const featuredCount = books.filter(book => book.is_featured || book.featured).length;
        
        // Estimate storage (rough calculation)
        const avgBookSize = 2.5; // MB average
        const estimatedStorage = (books.length * avgBookSize).toFixed(1);
        
        setStats({
          totalBooks: books.length,
          genres: genresSet.size,
          featured: featuredCount,
          storageUsed: estimatedStorage
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      style={{
        background: '#000000',
        borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Effects */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none'
            }}
            animate={{
              x: [
                Math.random() * 1000,
                Math.random() * 1000
              ],
              y: [
                Math.random() * 400,
                Math.random() * 400
              ],
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.5
        }} />
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 24px', position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '60px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h3 style={{ 
              fontSize: 'clamp(28px, 5vw, 48px)', 
              fontWeight: '900', 
              color: '#ffffff', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              marginBottom: '12px'
            }}>
              <motion.div
                style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4)'
                }}
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                📊
              </motion.div>
              <span>Admin Dashboard</span>
            </h3>
            <p style={{ 
              color: '#c4b5fd', 
              fontSize: 'clamp(14px, 2vw, 18px)', 
              fontWeight: '600',
              marginLeft: '72px'
            }}>
              Library statistics and overview
            </p>
          </div>
          <motion.button
            onClick={onClose}
            style={{
              padding: '14px 28px',
              background: 'rgba(239, 68, 68, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: '900',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.25)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span style={{ fontSize: '20px' }}>✕</span>
            <span>Close</span>
          </motion.button>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px' }}>
            <motion.div
              style={{
                width: '60px',
                height: '60px',
                border: '4px solid rgba(168, 85, 247, 0.2)',
                borderTopColor: '#a855f7',
                borderRadius: '50%'
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 640 ? '1fr' : window.innerWidth < 1024 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '24px'
          }}>
            {/* Total Books */}
            <StatCard
              icon="📚"
              title="Total Books"
              value={stats.totalBooks}
              gradient="from-purple-500 to-indigo-600"
              delay={0.1}
            />

            {/* Genres */}
            <StatCard
              icon="🏷️"
              title="Genres"
              value={stats.genres}
              gradient="from-blue-500 to-cyan-600"
              delay={0.2}
            />

            {/* Featured Books */}
            <StatCard
              icon="⭐"
              title="Featured"
              value={stats.featured}
              gradient="from-amber-500 to-orange-600"
              delay={0.3}
            />

            {/* Storage Used */}
            <StatCard
              icon="💾"
              title="Storage Used"
              value={`${stats.storageUsed} GB`}
              gradient="from-green-500 to-emerald-600"
              delay={0.4}
            />
          </div>
        )}

        {/* Info Section */}
        <motion.div
          style={{
            marginTop: '60px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '24px',
            padding: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            style={{
              fontSize: '48px',
              background: 'rgba(99, 102, 241, 0.15)',
              borderRadius: '20px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            💡
          </motion.div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', marginBottom: '8px' }}>
              Managing Your Library
            </h4>
            <p style={{ fontSize: '15px', color: '#c4b5fd', lineHeight: 1.6, fontWeight: '600' }}>
              Use your Python scripts to upload books in bulk. The public library view allows you to delete individual books when needed. 
              All books are automatically categorized by genre for easy browsing.
            </p>
          </div>
        </motion.div>

        {/* Quick Actions - Optional */}
        <motion.div
          style={{
            marginTop: '40px',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={() => window.open('/library', '_blank')}
            style={{
              padding: '14px 28px',
              background: 'rgba(168, 85, 247, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '16px',
              color: '#e9d5ff',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: '800',
              fontSize: '15px',
              cursor: 'pointer'
            }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(168, 85, 247, 0.25)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span>📖</span>
            <span>View Public Library</span>
          </motion.button>

          <motion.button
            onClick={fetchStats}
            style={{
              padding: '14px 28px',
              background: 'rgba(59, 130, 246, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '16px',
              color: '#93c5fd',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: '800',
              fontSize: '15px',
              cursor: 'pointer'
            }}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.25)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🔄</span>
            <span>Refresh Stats</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Stat Card Component
function StatCard({ icon, title, value, gradient, delay }) {
  return (
    <motion.div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, borderColor: 'rgba(168, 85, 247, 0.3)' }}
    >
      {/* Gradient Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
        opacity: 0.1,
        pointerEvents: 'none'
      }}
      className={`bg-gradient-to-br ${gradient}`} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Icon */}
        <motion.div
          style={{
            width: '60px',
            height: '60px',
            background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            marginBottom: '20px',
            boxShadow: '0 8px 25px rgba(168, 85, 247, 0.3)'
          }}
          className={`bg-gradient-to-br ${gradient}`}
          whileHover={{ scale: 1.1, rotate: 10 }}
        >
          {icon}
        </motion.div>

        {/* Title */}
        <div style={{
          fontSize: '14px',
          fontWeight: '700',
          color: '#9ca3af',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {title}
        </div>

        {/* Value */}
        <div style={{
          fontSize: '36px',
          fontWeight: '900',
          color: '#ffffff',
          lineHeight: 1
        }}>
          {value}
        </div>
      </div>
    </motion.div>
  );
}