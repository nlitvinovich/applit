let allProducts = [];
let lastUpdateText = '';

// Загрузка CSV + чтение времени из первой строки
async function loadProducts() {
  const response = await fetch('products.csv?' + Date.now()); // защита от кэша
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

  // вторая строка — заголовок: id,model,price
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

// Индикатор времени последнего изменения прайса
function updateTimestamp() {
  const el = document.getElementById('update-time');
  el.textContent = `Последнее изменение прайса: ${lastUpdateText}`;
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
  updateTimestamp();
  setupSearch();
}

// Автообновление каждые 10 минут
setInterval(() => {
  location.reload();
}, 10 * 60 * 1000);

// Запуск
initCatalog();
