let allProducts = [];

// Загрузка CSV + получение времени последнего изменения
async function loadProducts() {
  const response = await fetch('products.csv?' + Date.now()); // защита от кэша
  const lastModified = response.headers.get('Last-Modified');

  updateTimestamp(lastModified);

  const text = await response.text();
  const lines = text.split('\n').slice(1);

  const products = [];

  for (const line of lines) {
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

// Рендер каталога
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

// Индикатор времени последнего изменения CSV (дата + время)
function updateTimestamp(lastModified) {
  const el = document.getElementById('update-time');

  if (!lastModified) {
    el.textContent = 'Последнее изменение прайса: неизвестно';
    return;
  }

  const date = new Date(lastModified);

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  el.textContent = `Прайс обновлен: ${dd}.${mm}.${yyyy} ${hh}:${min}`;
}

// Поиск
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

// Основной запуск
async function initCatalog() {
  allProducts = await loadProducts();
  renderProducts(allProducts);
  setupSearch();
}

// Автообновление каждые 10 минут
setInterval(() => {
  location.reload();
}, 10 * 60 * 1000);

// Запуск
initCatalog();
