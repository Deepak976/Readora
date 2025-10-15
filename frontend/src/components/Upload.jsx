import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Upload({ api, setUploadMsg, onSectionChange }) {
  const onUploadSuccess = () => {
    setUploadMsg("Document uploaded successfully to your personal library!");
    setTimeout(() => {
      setUploadMsg(null);
    }, 4000);
    window.dispatchEvent(new CustomEvent('refreshBooks'));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Enhanced Background Effects */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        {/* Floating Orbs - Subtle Green Accents */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: i % 2 === 0 ? '400px' : '300px',
              height: i % 2 === 0 ? '400px' : '300px',
              borderRadius: '50%',
              background: i % 3 === 0 
                ? 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)'
                : i % 3 === 1
                ? 'radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(52, 211, 153, 0.1) 0%, transparent 70%)',
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
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Visible Grid Pattern - Subtle Green */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.5
        }} />

        {/* Floating Upload Icons */}
        <motion.div
          style={{
            position: 'absolute',
            top: '33%',
            left: '16%',
            fontSize: '64px',
            opacity: 0.15
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          📤
        </motion.div>
        <motion.div
          style={{
            position: 'absolute',
            bottom: '33%',
            right: '16%',
            fontSize: '72px',
            opacity: 0.15
          }}
          animate={{
            y: [0, -40, 0],
            rotate: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          📄
        </motion.div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, padding: '80px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Enhanced Header */}
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
                background: 'linear-gradient(135deg, #ffffff 0%, #d1fae5 25%, #a7f3d0 50%, #6ee7b7 75%, #34d399 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 60px rgba(16, 185, 129, 0.5))',
                letterSpacing: '-2px'
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
              Upload Documents
            </motion.h1>
            <p style={{
              fontSize: 'clamp(16px, 2.5vw, 24px)',
              color: '#d1fae5',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: 1.6,
              fontWeight: '600'
            }}>
              Build your private digital library with secure document storage
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '2fr 1fr',
            gap: '32px'
          }}>
            {/* Left Column - Upload Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Privacy Notice */}
              <motion.div 
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '32px',
                  padding: '32px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <motion.div
                    style={{
                      width: '56px',
                      height: '56px',
                      background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      flexShrink: 0,
                      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)'
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    🔒
                  </motion.div>
                  <div>
                    <h2 style={{
                      fontSize: '24px',
                      fontWeight: '900',
                      color: '#dbeafe',
                      marginBottom: '20px'
                    }}>
                      Privacy & Security
                    </h2>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: window.innerWidth < 640 ? '1fr' : 'repeat(2, 1fr)',
                      gap: '16px',
                      fontSize: '14px'
                    }}>
                      {[
                        "100% Private - Only accessible by you",
                        "No Sharing - We never access your files",
                        "Secure Storage - Encrypted and protected",
                        "Your Control - Delete anytime"
                      ].map((point, index) => (
                        <motion.div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px'
                          }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <span style={{ color: '#34d399', marginTop: '2px', fontWeight: '900' }}>✓</span>
                          <span style={{ color: '#dbeafe', fontWeight: '600' }}>{point}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Upload Form */}
              <motion.div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '32px',
                  padding: '40px',
                  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                  <motion.div
                    style={{
                      width: '64px',
                      height: '64px',
                      background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                      borderRadius: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      boxShadow: '0 12px 30px rgba(16, 185, 129, 0.4)'
                    }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    📚
                  </motion.div>
                  <div>
                    <h2 style={{
                      fontSize: '28px',
                      fontWeight: '900',
                      color: '#ffffff',
                      marginBottom: '4px'
                    }}>
                      Upload to My Library
                    </h2>
                    <p style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '600' }}>
                      Add documents to your personal collection
                    </p>
                  </div>
                </div>
                <UserUploadForm onUploadSuccess={onUploadSuccess} api={api} />
              </motion.div>
            </div>

            {/* Right Column - Tips and Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Upload Tips */}
              <motion.div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '24px',
                  padding: '28px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '900',
                  color: '#ffffff',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '24px' }}>💡</span>
                  Upload Tips
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { icon: "✅", title: "PDF Format", desc: "Up to 100MB each" },
                    { icon: "🎯", title: "Drag & Drop", desc: "Easy file selection" },
                    { icon: "🏷️", title: "Auto-titles", desc: "From filenames" },
                    { icon: "🔍", title: "Searchable", desc: "Find easily later" }
                  ].map((tip, index) => (
                    <motion.div 
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '14px',
                        padding: '12px',
                        borderRadius: '14px',
                        background: 'rgba(255, 255, 255, 0.05)'
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ x: 6, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                    >
                      <span style={{
                        fontSize: '24px',
                        filter: 'drop-shadow(0 0 8px rgba(52, 211, 153, 0.5))'
                      }}>
                        {tip.icon}
                      </span>
                      <div>
                        <div style={{
                          fontWeight: '800',
                          color: '#ffffff',
                          fontSize: '15px',
                          marginBottom: '4px'
                        }}>
                          {tip.title}
                        </div>
                        <div style={{
                          color: '#6ee7b7',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}>
                          {tip.desc}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Use Cases */}
              <motion.div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '24px',
                  padding: '28px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '900',
                  color: '#ffffff',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '24px' }}>🎯</span>
                  Perfect For
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { icon: "📖", title: "Personal Library", items: ["eBooks", "Articles"] },
                    { icon: "🎓", title: "Academic", items: ["Research", "Papers"] },
                    { icon: "💼", title: "Professional", items: ["Reports", "Guides"] }
                  ].map((category, index) => (
                    <motion.div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '16px',
                        padding: '16px'
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(16, 185, 129, 0.08)' }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '10px'
                      }}>
                        <span style={{ fontSize: '24px' }}>{category.icon}</span>
                        <span style={{
                          fontWeight: '800',
                          color: '#ffffff',
                          fontSize: '15px'
                        }}>
                          {category.title}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {category.items.map((item, i) => (
                          <span key={i} style={{
                            fontSize: '12px',
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#6ee7b7',
                            padding: '4px 12px',
                            borderRadius: '50px',
                            fontWeight: '700',
                            border: '1px solid rgba(16, 185, 129, 0.3)'
                          }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              {onSectionChange && (
                <motion.div
                  style={{
                    background: 'rgba(71, 85, 105, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '24px',
                    padding: '28px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                  }}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '900',
                    color: '#ffffff',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '24px' }}>🚀</span>
                    Quick Actions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <motion.button
                      onClick={() => onSectionChange('my-documents')}
                      style={{
                        width: '100%',
                        padding: '14px 20px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '14px',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                      whileHover={{ scale: 1.02, x: 6, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>📁</span>
                      View My Documents
                    </motion.button>
                    <motion.button
                      onClick={() => onSectionChange('public-library')}
                      style={{
                        width: '100%',
                        padding: '14px 20px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '14px',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                      whileHover={{ scale: 1.02, x: 6, backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>🌍</span>
                      Browse Public Library
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <motion.div
            style={{
              marginTop: '60px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '32px',
              padding: '40px',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 style={{
              fontSize: '32px',
              fontWeight: '900',
              color: '#ffffff',
              marginBottom: '40px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '40px' }}>❓</span>
              Frequently Asked Questions
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 768 ? '1fr' : window.innerWidth < 1280 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: '24px'
            }}>
              {[
                {
                  question: "What file types are supported?",
                  answer: "Currently PDF files up to 100MB each. More formats coming soon."
                },
                {
                  question: "Are documents really private?",
                  answer: "Yes! Enterprise-grade security ensures only you can access your files."
                },
                {
                  question: "How much storage do I get?",
                  answer: "Generous free storage with notifications before limits."
                },
                {
                  question: "Can I organize documents?",
                  answer: "Add titles, authors, descriptions, and use powerful search."
                },
                {
                  question: "Can I download my files?",
                  answer: "Download any uploaded document anytime, anywhere."
                },
                {
                  question: "What about deleted files?",
                  answer: "Permanently removed from servers and cannot be recovered."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '20px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    y: -4,
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    borderColor: 'rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <h4 style={{
                    fontWeight: '800',
                    color: '#ffffff',
                    marginBottom: '12px',
                    fontSize: '15px',
                    lineHeight: 1.4
                  }}>
                    {faq.question}
                  </h4>
                  <p style={{
                    color: '#d1d5db',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    fontWeight: '500'
                  }}>
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* Enhanced User Upload Form Component */
function UserUploadForm({ onUploadSuccess, api }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef();

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => {
        setMsg(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleSubmit = async () => {
    if (!file) {
      setMsg({ type: "error", text: "Please select a PDF file" });
      return;
    }
    setBusy(true);
    setMsg(null);
    setUploadProgress(0);

    const fd = new FormData();
    fd.append("title", title);
    fd.append("author", author);
    fd.append("description", description || `Personal document uploaded on ${new Date().toLocaleDateString()}`);
    fd.append("genre", "");
    fd.append("copyright_status", "Personal Use");
    fd.append("language", "en");
    fd.append("is_public", "false");
    fd.append("library_type", "personal");
    fd.append("file", file);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 100);

    try {
      const res = await fetch(`${api}/books`, { method: "POST", body: fd });
      
      setUploadProgress(100);
      clearInterval(progressInterval);
      
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        const message = errBody?.detail || errBody?.message || `Upload failed (${res.status})`;
        throw new Error(message);
      }
      
      const data = await res.json();
      setMsg({ 
        type: "success", 
        text: `Successfully uploaded "${data.title}" to your documents` 
      });
      
      setTitle("");
      setAuthor("");
      setDescription("");
      setFile(null);
      setUploadProgress(0);
      if (fileRef.current) fileRef.current.value = "";
      
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error("user upload error:", err);
      setMsg({ type: "error", text: err.message || "Upload failed" });
      clearInterval(progressInterval);
      setUploadProgress(0);
    } finally {
      setBusy(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      if (fileRef.current) fileRef.current.files = e.dataTransfer.files;
      
      if (!title) {
        const autoTitle = droppedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(autoTitle);
      }
    } else {
      setMsg({ type: "error", text: "Please upload only PDF files" });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Enhanced File Upload Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{
          fontSize: '14px',
          fontWeight: '800',
          color: '#6ee7b7'
        }}>
          PDF File *
        </label>
        <div
          style={{
            position: 'relative',
            border: dragOver 
              ? '3px dashed #10b981'
              : file
              ? '3px dashed #10b981'
              : '3px dashed rgba(16, 185, 129, 0.5)',
            borderRadius: '24px',
            padding: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver
              ? 'rgba(16, 185, 129, 0.1)'
              : file
              ? 'rgba(16, 185, 129, 0.05)'
              : 'rgba(255, 255, 255, 0.03)',
            transition: 'all 0.3s',
            transform: dragOver ? 'scale(1.02)' : 'scale(1)'
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              setFile(selectedFile);
              if (selectedFile && !title) {
                const autoTitle = selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                setTitle(autoTitle);
              }
            }}
            style={{ display: 'none' }}
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <motion.div 
              style={{ fontSize: '80px' }}
              animate={{ 
                scale: dragOver ? 1.2 : file ? 1.1 : 1,
                y: dragOver ? -10 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              {file ? "📄" : "📤"}
            </motion.div>
            
            {file ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  borderRadius: '20px',
                  padding: '20px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                <div style={{
                  color: '#ffffff',
                  fontWeight: '800',
                  marginBottom: '8px',
                  fontSize: '16px'
                }}>
                  {file.name}
                </div>
                <div style={{
                  color: '#6ee7b7',
                  fontSize: '14px',
                  marginBottom: '12px',
                  fontWeight: '700'
                }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
                <div style={{
                  color: '#34d399',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: '800'
                }}>
                  <motion.span 
                    style={{
                      width: '8px',
                      height: '8px',
                      background: '#34d399',
                      borderRadius: '50%',
                      boxShadow: '0 0 10px #34d399'
                    }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  Ready to upload
                </div>
              </motion.div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  color: '#ffffff',
                  fontWeight: '900',
                  fontSize: '20px'
                }}>
                  Drop your PDF here
                </div>
                <div style={{
                  color: '#6ee7b7',
                  fontSize: '16px',
                  fontWeight: '700'
                }}>
                  or click to browse files
                </div>
                <div style={{
                  color: '#34d399',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Maximum: 100MB • Format: PDF only
                </div>
              </div>
            )}
          </div>

          {dragOver && (
            <div style={{
              position: 'absolute',
              inset: '16px',
              border: '2px dashed #10b981',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}>
              <div style={{
                color: '#6ee7b7',
                fontWeight: '900',
                fontSize: '18px'
              }}>
                Drop file here!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(2, 1fr)',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{
            fontSize: '14px',
            fontWeight: '800',
            color: '#6ee7b7'
          }}>
            Document Title *
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              outline: 'none'
            }}
            placeholder="Enter document title"
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{
            fontSize: '14px',
            fontWeight: '800',
            color: '#6ee7b7'
          }}>
            Author/Source
          </label>
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              outline: 'none'
            }}
            placeholder="Author or source (optional)"
          />
        </div>
      </div>

      {/* Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{
          fontSize: '14px',
          fontWeight: '800',
          color: '#6ee7b7'
        }}>
          Description (Optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: '100%',
            padding: '16px 20px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            color: '#ffffff',
            fontSize: '15px',
            fontWeight: '600',
            outline: 'none',
            resize: 'none',
            fontFamily: 'inherit'
          }}
          placeholder="Brief description of the document"
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={busy || !title.trim()}
        style={{
          width: '100%',
          padding: '18px 32px',
          background: busy || !title.trim()
            ? 'linear-gradient(135deg, #6b7280, #4b5563)'
            : 'linear-gradient(135deg, #10b981, #14b8a6)',
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: '900',
          borderRadius: '18px',
          border: 'none',
          cursor: busy || !title.trim() ? 'not-allowed' : 'pointer',
          boxShadow: busy || !title.trim() 
            ? 'none'
            : '0 12px 30px rgba(16, 185, 129, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}
        whileHover={!busy && title.trim() ? { scale: 1.02, y: -2 } : {}}
        whileTap={!busy && title.trim() ? { scale: 0.98 } : {}}
      >
        {busy && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #10b981, #14b8a6)'
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'rgba(52, 211, 153, 0.3)',
                transformOrigin: 'left'
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: uploadProgress / 100 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          {busy ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <motion.div
                style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%'
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Uploading... {Math.round(uploadProgress)}%</span>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '20px' }}>📁</span>
              <span>Add to My Documents</span>
            </div>
          )}
        </div>
      </motion.button>

      {/* Messages */}
      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            style={{
              padding: '16px 20px',
              borderRadius: '18px',
              textAlign: 'center',
              fontWeight: '800',
              fontSize: '14px',
              border: msg.type === "error"
                ? '1px solid rgba(220, 38, 38, 0.3)'
                : '1px solid rgba(16, 185, 129, 0.3)',
              background: msg.type === "error"
                ? 'rgba(220, 38, 38, 0.15)'
                : 'rgba(16, 185, 129, 0.15)',
              color: msg.type === "error" ? '#fca5a5' : '#6ee7b7'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '20px' }}>
                {msg.type === "error" ? "❌" : "✅"}
              </span>
              <span>{msg.text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}