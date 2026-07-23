let products = [];
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

/* Обновление счётчика корзины */
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

    // 1-я строка: last_update,23.07.2026 20:47
    const first = lines[0].split(',');
    const lastUpdate = first[1]?.trim();

    // 2-я строка — заголовки: id,model,price
    const headers = lines[1].split(',');

    // товары начинаются с 3-й строки
    products = lines.slice(2).map(line => {
      const cols = line.split(',');
      const obj = {};
      headers.forEach((h, i) => obj[h.trim()] = cols[i]?.trim());
      return obj;
    });

    renderCatalog(products);
    updateTime(lastUpdate);
  })
  .catch(err => console.error(err));

/* Обновление времени */
function updateTime(lastUpdate) {
  const el = document.getElementById('update-time');
  if (!el) return;

  el.textContent = lastUpdate
    ? `Обновлено: ${lastUpdate}`
    : `Обновлено: ${new Date().toLocaleString('ru-RU')}`;
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

/* Открытие корзины */
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

/* Анимация поднятия таббара при скролле */
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const tabbar = document.querySelector('.tabbar');
  const currentScroll = window.scrollY;

  if (currentScroll > lastScroll + 10) {
    tabbar.classList.add('lifted');
  } else if (currentScroll < lastScroll - 10) {
    tabbar.classList.remove('lifted');
  }

  lastScroll = currentScroll;
});
