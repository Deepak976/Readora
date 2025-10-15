const API_BASE = "http://127.0.0.1:8000";

// Load books from backend
async function loadBooks() {
  const res = await fetch(`${API_BASE}/books/`);
  const books = await res.json();
  
  const list = document.getElementById("booksList");
  list.innerHTML = "";

  books.forEach(book => {
    const div = document.createElement("div");
    div.className = "p-4 border rounded flex justify-between items-center";
    div.innerHTML = `
      <div>
        <h3 class="text-lg font-bold">${book.title}</h3>
        <p class="text-gray-600">${book.author || "Unknown Author"}</p>
        <p class="text-sm text-gray-500">${book.description || ""}</p>
      </div>
      <a href="${API_BASE}/books/${book.id}/download" target="_blank" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Download</a>
    `;
    list.appendChild(div);
  });
}

// Upload book
document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);

  const res = await fetch(`${API_BASE}/books/`, {
    method: "POST",
    body: formData
  });

  if (res.ok) {
    alert("Book uploaded successfully!");
    e.target.reset();
    loadBooks();
  } else {
    alert("Failed to upload book");
  }
});

loadBooks();
