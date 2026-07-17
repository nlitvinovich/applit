// Загружаем CSV и превращаем в массив объектов
async function loadProducts() {
  const response = await fetch('products.csv');
  const text = await response.text();

  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  const products = lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = values[i].trim());
    return obj;
  });

  return products;
}

// Рендер каталога
function renderProducts(list) {
  const container = document.getElementById('catalog');
  container.innerHTML = '';

  list.forEach(p => {
    const item = document.createElement('div');
    item.className = 'product-item';
    item.innerHTML = `
      <div class="model">${p.model}</div>
      <div class="price">${p.price} BYN</div>
    `;
    container.appendChild(item);
  });
}

// Инициализация
let allProducts = [];

loadProducts().then(data => {
  allProducts = data;
  renderProducts(allProducts);
});

// Поиск
document.getElementById('search').addEventListener('input', function() {
  const q = this.value.toLowerCase().trim();
  const filtered = allProducts.filter(p => p.model.toLowerCase().includes(q));
  renderProducts(filtered);
});
