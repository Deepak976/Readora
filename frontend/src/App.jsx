// frontend/src/App.jsx - With Admin Keyboard Shortcut Auth
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Home from "./components/Home";
import PublicLibrary from "./components/PublicLibrary";
import MyDocuments from "./components/MyDocuments";
import Upload from "./components/Upload";
import About from "./components/About";
import Contact from "./components/Contact";
import PDFViewer from "./components/PDFViewer";
import AdminPanel from "./components/AdminPanel";

// Use Vite env if set, otherwise default
const API = import.meta.env.VITE_API || "http://localhost:8000";

export default function App() {
  // Global state
  const [activeSection, setActiveSection] = useState('home');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);
  const [error, setError] = useState(null);
  
  // PDF Viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ============================================================================
  // ADMIN AUTHENTICATION - Keyboard Shortcut (Ctrl + Shift + A)
  // ============================================================================
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if already authenticated (from sessionStorage)
    const adminStatus = sessionStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }

    // Keyboard shortcut listener: Ctrl + Shift + A
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        const newAdminState = !isAdmin;
        setIsAdmin(newAdminState);
        sessionStorage.setItem('isAdmin', newAdminState.toString());
        
        // Optional: Show notification when toggling admin mode
        if (newAdminState) {
          console.log('🔧 Admin mode activated');
          setUploadMsg('Admin mode activated! 🔧');
        } else {
          console.log('👋 Admin mode deactivated');
          setUploadMsg('Admin mode deactivated 👋');
        }
        setTimeout(() => setUploadMsg(null), 2000);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAdmin]);

  // ============================================================================

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    // Clear any errors when switching sections
    setError(null);
    // Scroll to top when changing sections
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setSelected(null);
    setPdfUrl(null);
    setError(null);
  };

  const openViewer = (book) => {
    setError(null);
    try {
      const inlineUrl = `${API}/books/${book.id}/download?inline=true`;
      setPdfUrl(inlineUrl);
      setSelected(book);
      setViewerOpen(true);
    } catch (e) {
      console.error("openViewer error:", e);
      setError("Could not open book. See console for details.");
    }
  };

  const handleDownload = async (book) => {
    setError(null);
    try {
      const res = await fetch(`${API}/books/${book.id}/download`);
      if (!res.ok) {
        const ebody = await res.text().catch(() => "");
        throw new Error(`Could not get download URL (${res.status}) ${ebody}`);
      }
      const { url } = await res.json();
      if (!url) throw new Error("No URL returned from server");
      window.open(url, "_blank");
    } catch (e) {
      console.error("download error:", e);
      setError("Could not download file. See console for details.");
    }
  };

  const handleDeleteBook = async (book) => {
    try {
      const res = await fetch(`${API}/books/${book.id}`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        let errorBody = "";
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorJson = await res.json();
            errorBody = errorJson.detail || errorJson.message || JSON.stringify(errorJson);
          } else {
            errorBody = await res.text();
          }
        } catch (parseError) {
          errorBody = "Could not parse error response";
        }
        throw new Error(`Failed to delete book (${res.status}): ${errorBody}`);
      }

      setDeleteConfirm(null);
      setUploadMsg(`"${book.title}" has been deleted successfully`);
      setTimeout(() => setUploadMsg(null), 3000);
      
      // Trigger refresh in components
      window.dispatchEvent(new CustomEvent('refreshBooks'));
      
    } catch (e) {
      console.error("delete error:", e);
      setError(`Could not delete "${book.title}". ${e.message}`);
      setDeleteConfirm(null);
    }
  };

  // Page transition animations
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 0.98
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  // Render the active section component
  const renderActiveSection = () => {
    const commonProps = {
      api: API,
      openViewer,
      handleDownload,
      onSectionChange: handleSectionChange
    };

    switch (activeSection) {
      case 'home':
        return <Home {...commonProps} />;
      case 'public-library':
        return (
          <PublicLibrary 
            {...commonProps}
            isAdmin={isAdmin}
          />
        );
      case 'my-documents':
        return (
          <MyDocuments 
            {...commonProps}
            setDeleteConfirm={setDeleteConfirm}
          />
        );
      case 'upload':
        return (
          <Upload 
            {...commonProps}
            setUploadMsg={setUploadMsg}
          />
        );
      case 'about':
        return <About {...commonProps} />;
      case 'contact':
        return <Contact {...commonProps} />;
      default:
        return <Home {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Google fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Header - Pass isAdmin prop */}
      <Header 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        showAdminPanel={showAdminPanel}
        setShowAdminPanel={setShowAdminPanel}
        isAdmin={isAdmin}
      />

      {/* Admin Panel - Only shows when admin button is clicked */}
      <AnimatePresence>
        {showAdminPanel && isAdmin && (
          <AdminPanel 
            onClose={() => setShowAdminPanel(false)}
            api={API}
            setUploadMsg={setUploadMsg}
          />
        )}
      </AnimatePresence>

      {/* Main Content with Tab Switching */}
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-[calc(100vh-80px)]"
          >
            {renderActiveSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer onSectionChange={handleSectionChange} />

      {/* Global Success/Error Messages */}
      <AnimatePresence>
        {uploadMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-6 left-1/2 transform z-50 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 text-center font-medium shadow-2xl backdrop-blur-sm"
          >
            ✅ {uploadMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-6 left-1/2 transform z-50 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-center font-medium shadow-2xl backdrop-blur-sm"
          >
            ❌ {error}
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-red-300 hover:text-white"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              className="bg-gray-900 border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🗑️</div>
                <h3 className="text-xl font-bold text-white mb-4">Delete Document?</h3>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to permanently delete <strong>"{deleteConfirm.title}"</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteBook(deleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {viewerOpen && pdfUrl && (
          <PDFViewer 
            url={pdfUrl}
            onClose={closeViewer}
            book={selected}
          />
        )}
      </AnimatePresence>

      {/* Admin Mode Indicator - Only visible when admin mode is active (optional) */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-40 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-200 text-sm font-semibold backdrop-blur-sm shadow-lg"
          >
            🔧 Admin Mode Active
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}