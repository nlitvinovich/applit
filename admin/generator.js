let lastCSV = "";

// Округление цены до 5
function roundPrice(price) {
  return Math.round(price / 5) * 5;
}

function generate() {
  const raw = document.getElementById('input').value;

  const blacklist = [
    "http", "https", "Телефон", "instagram", "Telegram",
    "GadgetStore", "edited", "Views", "img",
    "iPhone 17 Pro /", "iPhone 17 /", "iPhone 16 /", "iPhone 15 /",
    "IPAD", "ПЛАНШЕТЫ", "аксессуары"
  ];

  const lines = raw.split(/<br>/g)
    .map(l => l.replace(/<[^>]+>/g, "")) 
    .map(l => l.trim())
    .filter(l => l.includes(" - "))
    .filter(l => !blacklist.some(b => l.toLowerCase().includes(b.toLowerCase())))
    .filter(l => /\d+\s*BYN/i.test(l));

  let id = 1;
  let csv = "id,category,name,memory,color,sim,price\n";

  lines.forEach(line => {
    const [left, right] = line.split(" - ");
    let price = parseInt(right.replace("BYN", "").trim());
    price = roundPrice(price);

    const lower = left.toLowerCase();
    const parts = left.split(" ");

    // Категория — строгая логика
    let category = "Accessory";

    if (/^(17|16|15|14|13|12|11|10|9|8|7|6|5|4|3|2|1)/.test(left)) {
      category = "iPhone";
    } else if (lower.includes("ipad")) {
      category = "iPad";
    } else if (lower.includes("macbook") || lower.includes("air 13") || lower.includes("air 15")) {
      category = "MacBook";
    } else if (lower.includes("s11") || lower.includes("se3") || lower.includes("40") || lower.includes("44") || lower.includes("42") || lower.includes("46")) {
      category = "Apple Watch";
    } else if (lower.includes("airpods")) {
      category = "AirPods";
    } else if (lower.includes("pencil")) {
      category = "Pencil";
    } else if (lower.includes("airtag")) {
      category = "AirTag";
    }

    const name = left.trim();

    // Память
    const memory = parts.find(p => p.includes("TB") || p.includes("GB") || /\d+\/\d+/.test(p)) || "";

    // Цвет
    const colors = [
      "black","white","blue","orange","silver","gold","pink","lavender",
      "sage","midnight","teal","ultramarine","starlight","sky","citrus",
      "indigo","blush","purple","gray"
    ];
    let color = colors.find(c => lower.includes(c)) || "";

    // SIM — только для iPhone
    let sim = "";
    if (category === "iPhone") {
      sim = "eSIM";
      if (lower.includes("sim+esim")) sim = "SIM+eSIM";
      if (lower.includes("sim+sim")) sim = "SIM+SIM";
    }

    csv += `${id},${category},${name},${memory},${color},${sim},${price}\n`;
    id++;
  });

  lastCSV = csv;
  document.getElementById('output').textContent = csv;
}

function downloadCSV() {
  if (!lastCSV) return alert("Сначала сгенерируй CSV!");

  const blob = new Blob([lastCSV], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "products.csv";
  a.click();

  URL.revokeObjectURL(url);
}
