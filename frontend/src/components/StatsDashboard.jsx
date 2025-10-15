// frontend/src/components/StatsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const StatsDashboard = ({ api }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${api}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-white/20 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: "Total Books",
      value: stats.total_books || 0,
      icon: "📚",
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "Authors",
      value: stats.unique_authors || 0,
      icon: "👤",
      color: "from-green-500 to-blue-500"
    },
    {
      title: "Languages",
      value: stats.languages_available || 1,
      icon: "🌐",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Public Domain",
      value: stats.public_domain_books || 0,
      icon: "⚖️",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
            <div className="text-sm text-indigo-300">{stat.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Copyright Distribution */}
      {stats.copyright_distribution && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📋 Copyright Status</h3>
          <div className="space-y-3">
            {stats.copyright_distribution.map((item, index) => {
              const percentage = ((item.count / stats.total_books) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-indigo-200 capitalize">
                    {item.status.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-white/10 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-white min-w-[40px]">{item.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Authors */}
      {stats.top_authors && stats.top_authors.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">✍️ Top Authors</h3>
          <div className="space-y-2">
            {stats.top_authors.slice(0, 5).map((author, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-indigo-200">{author.name}</span>
                <span className="text-white bg-white/10 px-2 py-1 rounded text-sm">
                  {author.book_count} books
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StatsDashboard;