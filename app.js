// Загрузка CSV
async function loadProducts() {
  const response = await fetch('products.csv?' + Date.now()); // защита от кэша
  const text = await response.text();

  const lines = text.split('\n').slice(1); // пропускаем заголовок
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

// Обновление индикатора времени
function updateTimestamp() {
  const el = document.getElementById('update-time');
  const now = new Date();

  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');

  el.textContent = `Обновлено: ${hh}:${mm}`;
}

// Основной запуск
async function initCatalog() {
  const products = await loadProducts();
  renderProducts(products);
  updateTimestamp();
}

// Автообновление каждые 10 минут
setInterval(() => {
  location.reload();
}, 10 * 60 * 1000);

// Запуск
initCatalog();
