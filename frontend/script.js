document.getElementById("fetchBooks").addEventListener("click", async () => {
    try {
        const res = await fetch("http://localhost:5000/books"); // Change if backend port differs
        const data = await res.json();

        const list = document.getElementById("bookList");
        list.innerHTML = "";

        data.forEach(book => {
            const div = document.createElement("div");
            div.className = "p-4 bg-gray-800 rounded shadow";
            div.textContent = `${book.title} by ${book.author}`;
            list.appendChild(div);
        });

    } catch (err) {
        console.error("Error fetching books:", err);
    }
});
