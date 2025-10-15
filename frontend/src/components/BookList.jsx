import React from "react";
import { motion } from "framer-motion";

export default function BookList({ books, loading, onRead, onDownload }) {
  if (loading) return <div>Loading...</div>;

  if (!books.length)
    return <div style={{ color: "#64748b" }}>No books yet — upload one to get started.</div>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
      }}
    >
      {books.map((book) => (
        <motion.article
          key={book.id}
          layout
          whileHover={{ y: -4 }}
          style={{
            borderRadius: 16,
            border: "1px solid #e5e7eb",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{book.title}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>{book.author || "Unknown"}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>{book.description}</div>
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 10, color: "#94a3b8" }}>{book.filename}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => onRead(book)}
                style={{ ...buttonStyle, backgroundColor: "#4f46e5", color: "white" }}
              >
                Read
              </button>
              <button onClick={() => onDownload(book)} style={buttonStyle}>
                Download
              </button>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

const buttonStyle = {
  padding: "6px 12px",
  backgroundColor: "#e0e7ff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
