import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact({ onSectionChange }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mnnglqre";
  const CONTACT_EMAIL = "deepak427765@gmail.com";

  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [submitMessage]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      if (response.ok) {
        setSubmitMessage({
          type: 'success',
          text: 'Message sent successfully! We\'ll get back to you within 24-48 hours.'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Failed to send message. Please try emailing us directly at ' + CONTACT_EMAIL
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: "📧",
      title: "Email Us",
      description: "Send us an email anytime",
      action: () => window.location.href = `mailto:${CONTACT_EMAIL}`,
      actionText: "Send Email",
      gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
      glowColor: "rgba(59, 130, 246, 0.4)"
    },
    {
      icon: "💬",
      title: "Use Contact Form",
      description: "Fill the form and we'll respond",
      action: () => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }),
      actionText: "Fill Form",
      gradient: "linear-gradient(135deg, #10b981, #34d399)",
      glowColor: "rgba(16, 185, 129, 0.4)"
    },
    {
      icon: "💡",
      title: "Book Suggestions",
      description: "Suggest books for our library",
      action: () => window.location.href = `mailto:${CONTACT_EMAIL}?subject=Book Suggestion`,
      actionText: "Suggest Books",
      gradient: "linear-gradient(135deg, #a855f7, #ec4899)",
      glowColor: "rgba(168, 85, 247, 0.4)"
    }
  ];

  const faqs = [
    {
      question: "Is Readora completely free?",
      answer: "Yes! Readora is completely free to use. Both our public library and personal document features are available at no cost."
    },
    {
      question: "How do I add books to the public library?",
      answer: "Currently, our team manually curates the public library for quality. You can suggest books by contacting us!"
    },
    {
      question: "Are my documents private?",
      answer: "Absolutely. Your personal documents are completely private and only accessible by you. We never share or access your personal files."
    },
    {
      question: "Can I suggest books for the public library?",
      answer: "Yes! We love book suggestions. Contact us with titles you'd like to see, especially public domain classics."
    },
    {
      question: "How can I support Readora?",
      answer: "Share Readora with friends, provide feedback, suggest improvements, and help us grow our community of readers!"
    }
  ];

  const quickLinks = [
    {
      icon: "📚",
      title: "Browse Public Library",
      description: "Explore our collection of curated books",
      action: () => onSectionChange && onSectionChange('public-library'),
      actionText: "Browse Books",
      gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
      glowColor: "rgba(59, 130, 246, 0.4)"
    },
    {
      icon: "📤",
      title: "Upload Documents",
      description: "Start building your personal library",
      action: () => onSectionChange && onSectionChange('upload'),
      actionText: "Upload Now",
      gradient: "linear-gradient(135deg, #10b981, #34d399)",
      glowColor: "rgba(16, 185, 129, 0.4)"
    },
    {
      icon: "ℹ️",
      title: "Learn More",
      description: "Read about Readora's features and mission",
      action: () => onSectionChange && onSectionChange('about'),
      actionText: "About Readora",
      gradient: "linear-gradient(135deg, #a855f7, #ec4899)",
      glowColor: "rgba(168, 85, 247, 0.4)"
    }
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
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: i % 2 === 0 ? '450px' : '350px',
              height: i % 2 === 0 ? '450px' : '350px',
              borderRadius: '50%',
              background: i % 3 === 0 
                ? 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'
                : i % 3 === 1
                ? 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)'
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
            linear-gradient(rgba(59, 130, 246, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.6
        }} />

        <motion.div
          style={{
            position: 'absolute',
            top: '20%',
            right: '15%',
            fontSize: '80px',
            opacity: 0.15
          }}
          animate={{
            y: [0, -40, 0],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          📧
        </motion.div>
        <motion.div
          style={{
            position: 'absolute',
            bottom: '25%',
            left: '20%',
            fontSize: '100px',
            opacity: 0.15
          }}
          animate={{
            y: [0, -50, 0],
            rotate: [0, -12, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        >
          💬
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
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #10b981 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 60px rgba(59, 130, 246, 0.5))'
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
              Get In Touch
            </motion.h1>
            <p style={{
              fontSize: 'clamp(16px, 2.5vw, 24px)',
              color: '#d1d5db',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: 1.6,
              fontWeight: '600'
            }}>
              Have questions, suggestions, or need support? We'd love to hear from you!
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth >= 1024 ? '1fr 1fr' : '1fr',
            gap: '40px',
            marginBottom: '80px'
          }}>
            {/* Contact Form */}
            <motion.div
              id="contact-form"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '32px',
                padding: '48px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                pointerEvents: 'none'
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                  <motion.div
                    style={{
                      width: '64px',
                      height: '64px',
                      background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)'
                    }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    📝
                  </motion.div>
                  <div>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', marginBottom: '4px' }}>
                      Send us a Message
                    </h2>
                    <p style={{ color: '#9ca3af', fontSize: '16px', fontWeight: '600' }}>
                      We'll respond within 24-48 hours
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth >= 768 ? 'repeat(2, 1fr)' : '1fr',
                    gap: '24px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#60a5fa',
                        marginBottom: '8px'
                      }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '16px',
                          color: '#ffffff',
                          fontSize: '16px',
                          fontWeight: '500',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        placeholder="Your full name"
                        onFocus={(e) => {
                          e.target.style.border = '1px solid rgba(59, 130, 246, 0.5)';
                          e.target.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#60a5fa',
                        marginBottom: '8px'
                      }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '16px',
                          color: '#ffffff',
                          fontSize: '16px',
                          fontWeight: '500',
                          outline: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        placeholder="your@email.com"
                        onFocus={(e) => {
                          e.target.style.border = '1px solid rgba(59, 130, 246, 0.5)';
                          e.target.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#60a5fa',
                      marginBottom: '8px'
                    }}>
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '16px',
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: '500',
                        outline: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '1px solid rgba(59, 130, 246, 0.5)';
                        e.target.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="" style={{ background: '#1f2937', color: '#ffffff' }}>Select a subject</option>
                      <option value="general" style={{ background: '#1f2937', color: '#ffffff' }}>General Inquiry</option>
                      <option value="support" style={{ background: '#1f2937', color: '#ffffff' }}>Technical Support</option>
                      <option value="feedback" style={{ background: '#1f2937', color: '#ffffff' }}>Feedback & Suggestions</option>
                      <option value="partnership" style={{ background: '#1f2937', color: '#ffffff' }}>Partnership Opportunities</option>
                      <option value="content" style={{ background: '#1f2937', color: '#ffffff' }}>Content Issues</option>
                      <option value="book-suggestion" style={{ background: '#1f2937', color: '#ffffff' }}>Book Suggestions</option>
                      <option value="other" style={{ background: '#1f2937', color: '#ffffff' }}>Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#60a5fa',
                      marginBottom: '8px'
                    }}>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '16px',
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: '500',
                        outline: 'none',
                        resize: 'vertical',
                        transition: 'all 0.3s ease'
                      }}
                      placeholder="Tell us how we can help you..."
                      onFocus={(e) => {
                        e.target.style.border = '1px solid rgba(59, 130, 246, 0.5)';
                        e.target.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()}
                    style={{
                      width: '100%',
                      padding: '18px 32px',
                      background: isSubmitting || !formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()
                        ? 'rgba(100, 100, 100, 0.5)'
                        : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                      borderRadius: '16px',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '18px',
                      fontWeight: '900',
                      cursor: isSubmitting || !formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      boxShadow: isSubmitting || !formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()
                        ? 'none'
                        : '0 12px 30px rgba(59, 130, 246, 0.4)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    whileHover={!isSubmitting && formData.name.trim() && formData.email.trim() && formData.subject.trim() && formData.message.trim() ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isSubmitting && formData.name.trim() && formData.email.trim() && formData.subject.trim() && formData.message.trim() ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          style={{
                            width: '20px',
                            height: '20px',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            borderTop: '2px solid #ffffff',
                            borderRadius: '50%'
                          }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '24px' }}>📨</span>
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {submitMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      style={{
                        marginTop: '24px',
                        padding: '20px',
                        borderRadius: '20px',
                        textAlign: 'center',
                        fontWeight: '700',
                        border: submitMessage.type === 'success'
                          ? '1px solid rgba(16, 185, 129, 0.3)'
                          : '1px solid rgba(239, 68, 68, 0.3)',
                        background: submitMessage.type === 'success'
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(239, 68, 68, 0.15)',
                        color: submitMessage.type === 'success' ? '#6ee7b7' : '#fca5a5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        fontSize: '15px'
                      }}
                    >
                      <span style={{ fontSize: '24px' }}>{submitMessage.type === 'success' ? '✅' : '⚠️'}</span>
                      <span>{submitMessage.text}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
              {/* Contact Methods */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '32px',
                padding: '40px',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                  <motion.div
                    style={{
                      width: '56px',
                      height: '56px',
                      background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                      borderRadius: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      boxShadow: '0 8px 25px rgba(168, 85, 247, 0.4)'
                    }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    📱
                  </motion.div>
                  <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff' }}>
                    How to Reach Us
                  </h2>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {contactMethods.map((method, index) => (
                    <motion.div
                      key={index}
                      onClick={method.action}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '20px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.02,
                        x: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        boxShadow: `0 8px 25px ${method.glowColor}`
                      }}
                    >
                      <div style={{
                        fontSize: '32px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {method.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '900', color: '#ffffff', fontSize: '18px', marginBottom: '4px' }}>
                          {method.title}
                        </div>
                        <div style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '600' }}>
                          {method.description}
                        </div>
                      </div>
                      <motion.button
                        style={{
                          padding: '10px 20px',
                          background: method.gradient,
                          border: 'none',
                          borderRadius: '12px',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: '900',
                          cursor: 'pointer',
                          boxShadow: `0 4px 15px ${method.glowColor}`
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {method.actionText}
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  style={{
                    marginTop: '24px',
                    padding: '16px 20px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '20px'
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div style={{ fontSize: '14px', color: '#93c5fd', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>📧</span>
                    <span><span style={{ fontWeight: '900' }}>Direct Email:</span> {CONTACT_EMAIL}</span>
                  </div>
                </motion.div>
              </div>

              {/* FAQ Section */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '32px',
                padding: '40px',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                  <motion.div
                    style={{
                      width: '56px',
                      height: '56px',
                      background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
                      borderRadius: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      boxShadow: '0 8px 25px rgba(236, 72, 153, 0.4)'
                    }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    ❓
                  </motion.div>
                  <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff' }}>
                    Quick Answers
                  </h2>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '20px',
                        padding: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        transition: 'all 0.3s ease'
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.01,
                        x: 5,
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        borderColor: 'rgba(255, 255, 255, 0.15)'
                      }}
                    >
                      <div style={{ fontWeight: '900', color: '#ffffff', marginBottom: '8px', fontSize: '15px' }}>
                        {faq.question}
                      </div>
                      <div style={{ color: '#d1d5db', fontSize: '14px', lineHeight: 1.6, fontWeight: '500' }}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ marginBottom: '80px' }}
          >
            <h2 style={{
              fontSize: '48px',
              fontWeight: '900',
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: '60px'
            }}>
              Need Help Right Now?
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth >= 768 ? 'repeat(3, 1fr)' : '1fr',
              gap: '32px'
            }}>
              {quickLinks.map((link, index) => (
                <motion.div
                  key={index}
                  onClick={link.action}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '32px',
                    padding: '48px 32px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)',
                    cursor: 'pointer'
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.02,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    boxShadow: `0 30px 90px ${link.glowColor}`
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at 50% 50%, ${link.glowColor} 0%, transparent 70%)`,
                    pointerEvents: 'none'
                  }} />
                  
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div 
                      style={{
                        fontSize: '64px',
                        marginBottom: '24px',
                        display: 'inline-block',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '24px',
                        padding: '24px',
                        boxShadow: `0 8px 25px ${link.glowColor}`
                      }}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      {link.icon}
                    </motion.div>
                    <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff', marginBottom: '16px' }}>
                      {link.title}
                    </h3>
                    <p style={{ color: '#d1d5db', marginBottom: '24px', lineHeight: 1.6, fontSize: '15px', fontWeight: '500' }}>
                      {link.description}
                    </p>
                    <motion.button 
                      style={{
                        padding: '14px 28px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '16px',
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: '900',
                        cursor: 'pointer'
                      }}
                      whileHover={{ scale: 1.05, y: -2, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {link.actionText}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
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
              <p style={{ color: '#9ca3af', marginBottom: '8px', fontSize: '15px', fontWeight: '700' }}>
                📬 We read every message and respond within 24-48 hours
              </p>
              <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>
                Thank you for being part of the Readora community! 📚✨
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}