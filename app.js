let products = [];
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function updateCartCount() {
  const tabCart = document.getElementById('tab-cart');
  if (tabCart) {
    tabCart.textContent = `Корзина (${cart.length})`;
  }
}

updateCartCount();

/* Загрузка CSV */
fetch('products.csv?' + Date.now())
  .then(res => res.text())
  .then(text => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');

    products = lines.slice(1).map(line => {
      const cols = line.split(',');
      const obj = {};
      headers.forEach((h, i) => obj[h.trim()] = cols[i].trim());
      return obj;
    });

    renderCatalog(products);
    updateTime();
  })
  .catch(err => console.error(err));

function updateTime() {
  const el = document.getElementById('update-time');
  if (!el) return;
  const now = new Date();
  el.textContent = `Обновлено: ${now.toLocaleString('ru-RU')}`;
}

/* Рендер каталога */
function renderCatalog(data) {
  const catalog = document.getElementById('catalog');
  if (!catalog) return;

  catalog.innerHTML = '';

  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <div class="card-title">${item.model}</div>
      <button class="add-to-cart">🛒</button>
      <div class="card-price">${item.price} BYN</div>
    `;

    card.querySelector('.add-to-cart').addEventListener('click', () => {
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
    });

    catalog.appendChild(card);
  });
}

/* Поиск */
const searchInput = document.getElementById('search');
if (searchInput) {
  searchInput.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const filtered = products.filter(p =>
      (p.model || '').toLowerCase().includes(q)
    );
    renderCatalog(filtered);
  });
}

/* Открытие корзины по табу */
document.getElementById('tab-cart').addEventListener('click', () => {
  const modal = document.getElementById('cart-modal');
  const items = document.getElementById('cart-items');

  items.innerHTML = cart.map(i => `
    <div class="cart-item">
      <strong>${i.model}</strong> — ${i.price} BYN
    </div>
  `).join('');

  modal.style.display = 'flex';

  document.getElementById('tab-cart').classList.add('active');
  document.getElementById('tab-catalog').classList.remove('active');
});

/* Закрытие корзины */
document.getElementById('cart-close').addEventListener('click', () => {
  document.getElementById('cart-modal').style.display = 'none';

  document.getElementById('tab-catalog').classList.add('active');
  document.getElementById('tab-cart').classList.remove('active');
});

/* Переключение на каталог */
document.getElementById('tab-catalog').addEventListener('click', () => {
  document.getElementById('cart-modal').style.display = 'none';

  document.getElementById('tab-catalog').classList.add('active');
  document.getElementById('tab-cart').classList.remove('active');
});
