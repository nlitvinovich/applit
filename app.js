let allProducts = [];
let lastUpdateText = '';

//
// Авто‑создание строки поиска, если её нет в HTML
//
function ensureSearchField() {
  if (!document.getElementById('search')) {
    const input = document.createElement('input');
    input.id = 'search';
    input.type = 'text';
    input.placeholder = 'Поиск по моделям…';
    input.style = 'width:100%;padding:12px;font-size:16px;border-radius:8px;border:1px solid #ccc;margin-bottom:20px;';
    document.body.prepend(input);
  }

  if (!document.getElementById('update-time')) {
    const upd = document.createElement('div');
    upd.id = 'update-time';
    upd.style = 'margin-bottom:20px;color:#555;font-size:14px;';
    document.body.insertBefore(upd, document.getElementById('search').nextSibling);
  }

  if (!document.getElementById('catalog')) {
    const cat = document.createElement('div');
    cat.id = 'catalog';
    document.body.appendChild(cat);
  }
}

//
// Загрузка CSV + чтение времени из первой строки
//
async function loadProducts() {
  const response = await fetch('products.csv?' + Date.now());
  const text = await response.text();

  const lines = text.split('\n').filter(l => l.trim());

  if (lines.length < 2) return [];

  // первая строка: last_update,23.07.2026 20:28
  const [label, value] = lines[0].split(',');
  if (label && value && label.trim().toLowerCase() === 'last_update') {
    lastUpdateText = value.trim();
  } else {
    lastUpdateText = 'неизвестно';
  }

  // вторая строка — заголовок
  const dataLines = lines.slice(2);

  const products = [];

  for (const line of dataLines) {
    if (!line.trim()) continue;
    const [id, model, price] = line.split(',');

    products.push({
      id: Number(id),
      model: model.trim(),
      price: Number(price)
    });
  }

  return products;
}

//
// Рендер каталога
//
function renderProducts(list) {
  const container = document.getElementById('catalog');
  container.innerHTML = '';

  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <div class="card-title">${p.model}</div>
      <div class="card-price">${p.price} BYN</div>
    `;

    container.appendChild(card);
  });
}

//
// Индикатор времени последнего изменения прайса
//
function updateTimestamp() {
  const el = document.getElementById('update-time');
  el.textContent = `Последнее изменение прайса: ${lastUpdateText}`;
}

//
// Поиск
//
function setupSearch() {
  const input = document.getElementById('search');

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();

    const filtered = allProducts.filter(p =>
      p.model.toLowerCase().includes(q)
    );

    renderProducts(filtered);
  });
}

//
// Основной запуск
//
async function initCatalog() {
  ensureSearchField();     // ← поиск создаётся автоматически
  allProducts = await loadProducts();
  renderProducts(allProducts);
  updateTimestamp();
  setupSearch();
}

//
// Автообновление каждые 10 минут
//
setInterval(() => {
  location.reload();
}, 10 * 60 * 1000);

//
// Запуск
//
initCatalog();
