import React, { useState, useRef, useEffect } from "react";

export default function UploadForm({ onUploadSuccess, api }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const fileRef = useRef();

  // Auto-clear messages after 5 seconds
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
    if (!title.trim()) {
      setMsg({ type: "error", text: "Please enter a document title" });
      return;
    }
    
    setBusy(true);
    setMsg(null);

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("author", author.trim() || "Unknown Author");
    fd.append("description", description.trim() || `Personal document uploaded on ${new Date().toLocaleDateString()}`);
    // Add required backend fields for personal documents
    fd.append("genre", "Personal");
    fd.append("copyright_status", "Personal Use");
    fd.append("language", "en");
    fd.append("is_public", "false");
    fd.append("library_type", "personal");
    fd.append("file", file);

    try {
      const res = await fetch(`${api}/books`, { method: "POST", body: fd });
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
      
      // Reset all fields
      setTitle("");
      setAuthor("");
      setDescription("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error("Upload error:", err);
      setMsg({ type: "error", text: err.message || "Upload failed" });
    } finally {
      setBusy(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    // Auto-fill title from filename if title is empty
    if (selectedFile && !title.trim()) {
      const autoTitle = selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTitle(autoTitle);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }} onKeyDown={handleKeyPress}>
      <div style={{ fontWeight: "600", fontSize: 18, color: "#1f2937", marginBottom: 8 }}>
        Upload New Document
      </div>
      
      <div>
        <label style={labelStyle}>
          Document Title *
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter document title"
          style={{
            ...inputStyle,
            borderColor: !title.trim() && msg ? "#dc2626" : "#d1d5db"
          }}
          onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
          onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
        />
      </div>

      <div>
        <label style={labelStyle}>
          Author/Source
        </label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author or source (optional)"
          style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
          onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
        />
      </div>

      <div>
        <label style={labelStyle}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description (optional)"
          rows={3}
          style={{ 
            ...inputStyle, 
            resize: "vertical", 
            fontFamily: "inherit",
            minHeight: "80px"
          }}
          onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
          onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
        />
      </div>

      <div>
        <label style={labelStyle}>
          PDF File *
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={fileInputStyle}
        />
        {file && (
          <div style={fileInfoStyle}>
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
        <button 
          onClick={handleSubmit}
          disabled={busy || !title.trim() || !file} 
          style={{
            ...buttonPrimaryStyle,
            opacity: (busy || !title.trim() || !file) ? 0.6 : 1,
            cursor: (busy || !title.trim() || !file) ? "not-allowed" : "pointer",
            backgroundColor: busy ? "#6b7280" : "#3b82f6"
          }}
          onMouseEnter={(e) => {
            if (!busy && title.trim() && file) {
              e.target.style.backgroundColor = "#2563eb";
            }
          }}
          onMouseLeave={(e) => {
            if (!busy && title.trim() && file) {
              e.target.style.backgroundColor = "#3b82f6";
            }
          }}
        >
          {busy ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
              <span style={spinnerStyle}>⏳</span>
              Uploading...
            </span>
          ) : (
            "Upload Document"
          )}
        </button>

        <div style={{ fontSize: 12, color: "#6b7280", textAlign: "center" }}>
          Tip: Press Ctrl+Enter to upload quickly
        </div>
      </div>

      {msg && (
        <div style={{
          ...messageStyle,
          color: msg?.type === "error" ? "#dc2626" : "#059669",
          backgroundColor: msg?.type === "error" ? "#fef2f2" : "#ecfdf5",
          border: `1px solid ${msg?.type === "error" ? "#fecaca" : "#a7f3d0"}`,
        }}>
          <span style={{ marginRight: 8 }}>
            {msg?.type === "error" ? "❌" : "✅"}
          </span>
          {msg?.text}
        </div>
      )}
      
      <div style={noteStyle}>
        <strong>Privacy:</strong> Your documents are completely private and only accessible by you.
        Files are securely stored and never shared.
      </div>

      {/* Upload Requirements */}
      <div style={requirementsStyle}>
        <div style={{ fontWeight: "600", marginBottom: 8, color: "#374151" }}>Upload Requirements:</div>
        <ul style={{ margin: 0, paddingLeft: 20, color: "#6b7280", fontSize: 12, lineHeight: 1.5 }}>
          <li>PDF format only</li>
          <li>Maximum file size: 100MB</li>
          <li>Document title is required</li>
          <li>All uploads are private by default</li>
        </ul>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: 4,
  fontSize: 14,
  fontWeight: "500",
  color: "#374151"
};

const inputStyle = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14,
  width: "100%",
  fontFamily: "inherit",
  transition: "border-color 0.2s ease",
  outline: "none",
  backgroundColor: "#ffffff"
};

const fileInputStyle = {
  ...inputStyle,
  padding: 8,
  cursor: "pointer",
  backgroundColor: "#f9fafb",
  border: "2px dashed #d1d5db",
  transition: "all 0.2s ease"
};

const fileInfoStyle = {
  marginTop: 8,
  fontSize: 12,
  color: "#059669",
  padding: "4px 8px",
  backgroundColor: "#ecfdf5",
  border: "1px solid #a7f3d0",
  borderRadius: 4,
  display: "inline-block"
};

const buttonPrimaryStyle = {
  padding: "12px 20px",
  backgroundColor: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: "600",
  transition: "all 0.2s ease",
  minHeight: "44px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const messageStyle = {
  fontSize: 14,
  padding: "8px 12px",
  borderRadius: 6,
  fontWeight: "500",
  display: "flex",
  alignItems: "center"
};

const noteStyle = {
  fontSize: 12,
  color: "#6b7280",
  padding: "8px 12px",
  backgroundColor: "#f3f4f6",
  borderRadius: 6,
  borderLeft: "3px solid #3b82f6",
  lineHeight: 1.4
};

const requirementsStyle = {
  fontSize: 12,
  padding: "8px 12px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 6,
  marginTop: 4
};

const spinnerStyle = {
  display: "inline-block",
  animation: "spin 1s linear infinite"
};