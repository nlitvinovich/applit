async function loadProducts() {
  const res = await fetch('products.csv');
  const text = await res.text();

  const rows = text.split('\n').map(r => r.split(','));
  const headers = rows[0];

  const data = rows.slice(1).map(r => {
    let obj = {};
    headers.forEach((h, i) => obj[h.trim()] = r[i]?.trim());
    return obj;
  });

  renderProducts(data);

  document.getElementById('search').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const filtered = data.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
    renderProducts(filtered);
  });

  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat;
      if (cat === "all") renderProducts(data);
      else renderProducts(data.filter(p => p.category === cat));
    });
  });
}

function renderProducts(products) {
  const container = document.getElementById('products');
  container.innerHTML = '';

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <div class="product-name">${p.name}</div>
      <div class="tags">
        ${p.memory ? `<div class="tag">${p.memory}</div>` : ""}
        ${p.color ? `<div class="tag">${p.color}</div>` : ""}
        ${p.sim ? `<div class="tag">${p.sim}</div>` : ""}
      </div>
      <div class="price">${p.price} BYN</div>
    `;

    container.appendChild(card);
  });
}

loadProducts();
