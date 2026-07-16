let products = [];

// Загружаем CSV
fetch("products.csv")
  .then(res => res.text())
  .then(text => {
    const lines = text.split("\n").slice(1); // пропускаем заголовок
    products = lines
      .filter(line => line.trim().length > 0)
      .map(line => {
        const [id, category, name, memory, color, sim, price] = line.split(",");
        return { id, category, name, memory, color, sim, price };
      });

    render(products);
  })
  .catch(err => console.error("Ошибка загрузки CSV:", err));


// Рендер каталога
function render(list) {
  const catalog = document.getElementById("catalog");
  catalog.innerHTML = "";

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${p.name}</h3>
      <p><b>Категория:</b> ${p.category}</p>
      <p><b>Память:</b> ${p.memory}</p>
      <p><b>Цвет:</b> ${p.color}</p>
      <p><b>SIM:</b> ${p.sim}</p>
      <p><b>Цена:</b> ${p.price} BYN</p>
    `;
    catalog.appendChild(card);
  });
}


// Фильтр по категории
function filterCategory(cat) {
  render(products.filter(p => p.category === cat));
}
