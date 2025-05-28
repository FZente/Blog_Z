async function fetchBlogs() {
  try {
    const res = await fetch('http://localhost:3000/blog');
    const data = await res.json();
    console.log("Visszakapott adat:", data);
    renderBlogs(data);
  } catch (err) {
    console.error("Hiba a lekéréskor:", err);
    alert('Hiba történt az blogok betöltésekor!');
  }
}

  async function fetchBlogById() {
    const id = document.getElementById('blog-id-input').value;
    if (!id) return alert("Adj meg egy blog ID-t!");

    const res = await fetch('http://localhost:3000/blog');
    const blogs = await res.json();
    const blog = blogs.find(a => a.id == id);

    if (!blog) {
      document.getElementById('blog-container').innerHTML =
        `<p class="text-center bg-danger text-light w-25 mx-auto d-block p-2">Nem található ilyen ID-jű album.</p>`;
      return;
    }

    renderBlogs([blog]);
  }

  function formatDate(datetimeString) {
  const date = new Date(datetimeString);
  return date.toLocaleString('hu-HU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

  function renderBlogs(blogs) {
    const container = document.getElementById('blog-container');
    container.innerHTML = '';

    blogs.forEach(blog => {
      const card = document.createElement('div');
      card.className = 'col-12 col-md-6 col-lg-6';
      card.innerHTML = `
        <div class="card h-100 shadow text-bg-white " style="background-image: url('images/postcard.jpg'); background-size: cover; background-position: center;">>
          <div class="card-body fs-5" style="color: black;">
            <h5 class="card-title d-flex justify-content-between align-items-center fs-3">
              <span>${blog.cim || '<i></i>'}</span>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-warning" onclick="editField(${blog.id}, 'cim', '${blog.cim || ''}')">✏️</button>
                <button class="btn btn-outline-danger" onclick="clearField(${blog.id}, 'cim')">🗑</button>
              </div>
            </h5>
            ${generateFieldRow(blog, 'Tartalma', 'content')}
            ${generateFieldRow(blog, 'Kategória', 'kategoria')}
            ${generateFieldRow(blog, 'Szerző', 'szerzo')}
            <div class="row">
              <div class="col-md-6">
                ${generateFieldRow(blog, 'Keltezés', 'created_at')}
              </div>
              <div class="col-md-6">
                ${generateFieldRow(blog, 'Módosítás dátuma', 'updated_at')}
              </div>
            </div>
            <div class="d-flex justify-content-center mt-3">
              <button class="btn btn-danger w-50" onclick="deleteBlog(${blog.id})">Törlés</button>
            </div>
          </div>
      `;
      container.appendChild(card);
    });
  }

  function generateFieldRow(blog, label, key) {
  const isDateField = key === 'created_at' || key === 'updated_at';
  const value = key.includes('_at') ? formatDate(blog[key]) : (blog[key] || '');

  return `
    <div class="d-flex justify-content-between align-items-start mb-2">
      <div><strong>${label}:</strong><br>${value}</div>
      ${!isDateField ? `
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-warning" onclick="editField(${blog.id}, '${key}', '${blog[key] || ''}')">✏️</button>
          <button class="btn btn-outline-danger" onclick="clearField(${blog.id}, '${key}')">🗑</button>
        </div>
      ` : ''}
    </div>
  `;
}

  async function createBlogs() {
    const szerzo = prompt("Szerző:");
    const cim = prompt("Blog címe:");
    const kategoria = prompt("Kategória:");
    const content = prompt("Tartalma:");
  
    if (!szerzo || !cim || !kategoria || !content) {
      alert("Minden mezőt ki kell tölteni!");
      return;
    }
  
    await fetch('http://localhost:3000/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ szerzo, cim, kategoria, content })
    });
  
    fetchBlogs();
  }

  async function editField(id, field, currentValue) {
    const newValue = prompt(`Új érték (${field}):`, currentValue);
    if (newValue === null || newValue.trim() === '' || newValue === currentValue) return;

    const res = await fetch('http://localhost:3000/blog');
    const blog = (await res.json()).find(a => a.id === id);
    blog[field] = newValue;

    await fetch(`http://localhost:3000/blog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(blog)
    });

    fetchBlogs();
  }

  async function clearField(id, field) {
  if (!confirm(`Biztosan törlöd a(z) "${field}" mezőt?`)) return;

  const res = await fetch(`http://localhost:3000/blog/${id}`);
  const blog = await res.json();

  const { szerzo = '', cim = '', kategoria = '', content = '' } = blog;
  const updatedBlog = {
    szerzo,
    cim,
    kategoria,
    content,
    [field]: '' 
  };

  await fetch(`http://localhost:3000/blog/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBlog)
  });

  fetchBlogs();
}

  async function deleteBlog(id) {
    if (confirm('Biztosan törlöd a blogot?')) {
      await fetch(`http://localhost:3000/blog/${id}`, {
        method: 'DELETE'
      });
      fetchBlogs();
    }
  }

  function toggleForm() {
    const formContainer = document.getElementById('blog-form-container');
    formContainer.classList.toggle('d-none');
  }

  document.getElementById('blog-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const szerzo = document.getElementById('szerzo').value.trim();
    const cim = document.getElementById('cim').value.trim();
    const kategoria = document.getElementById('kategoria').value.trim();
    const content = document.getElementById('content').value.trim();
  
    if (!szerzo || !cim || !kategoria || !content) {
      alert("Minden mezőt ki kell tölteni!");
      return;
    }
  
    await fetch('http://localhost:3000/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ szerzo, cim, kategoria, content })
    });
  
    e.target.reset(); 
    document.getElementById('blog-form-container').classList.add('d-none'); 
    fetchBlogs(); 
  });