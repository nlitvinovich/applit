let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function updateCartCount() {
  document.getElementById('tab-cart').textContent = `Корзина (${cart.length})`;
}
updateCartCount();

/* Рендер каталога */
function renderCatalog(data) {
  const catalog = document.getElementById('catalog');
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
