// ===== DATA =====
const flavors = [
  {
    id: 1,
    name: "Vainilla Clásica",
    desc: "Cremosa vainilla de Madagascar con un toque de caramelo.",
    emoji: "🍦",
    price: 4500,
    category: "clasico",
  },
  {
    id: 2,
    name: "Chocolate Intenso",
    desc: "Chocolate oscuro belga 70% con chips de cacao.",
    emoji: "🍫",
    price: 5000,
    category: "clasico",
  },
  {
    id: 3,
    name: "Fresa Natural",
    desc: "Fresas frescas de temporada batidas con crema fresca.",
    emoji: "🍓",
    price: 4800,
    category: "frutal",
  },
  {
    id: 4,
    name: "Mango Tropical",
    desc: "Pulpa de mango Tommy con un toque de chile y limón.",
    emoji: "🥭",
    price: 5200,
    category: "frutal",
  },
  {
    id: 5,
    name: "Maracuyá Cremoso",
    desc: "Maracuyá ácido equilibrado con leche condensada.",
    emoji: "🍋",
    price: 5100,
    category: "frutal",
  },
  {
    id: 6,
    name: "Arcoíris Unicornio",
    desc: "Swirl de colores pastel con chispas de azúcar y fondant.",
    emoji: "🌈",
    price: 6500,
    category: "especial",
  },
  {
    id: 7,
    name: "Oreo & Nutella",
    desc: "Base de vainilla con remolinos de Nutella y galleta Oreo.",
    emoji: "🍪",
    price: 6800,
    category: "especial",
  },
  {
    id: 8,
    name: "Menta con Chispas",
    desc: "Refrescante menta con chips de chocolate semiamargo.",
    emoji: "🌿",
    price: 5300,
    category: "clasico",
  },
  {
    id: 9,
    name: "Piña Colada",
    desc: "Piña natural con coco tostado y un toque de ron (sin alcohol).",
    emoji: "🍍",
    price: 5500,
    category: "frutal",
  },
  {
    id: 10,
    name: "Cheesecake de Mora",
    desc: "Queso crema con mermelada de mora y base de galleta graham.",
    emoji: "🫐",
    price: 7000,
    category: "especial",
  },
  {
    id: 11,
    name: "Dulce de Leche",
    desc: "Clásico argentino: manjar cremoso de leche caramelizada.",
    emoji: "🐮",
    price: 4900,
    category: "clasico",
  },
  {
    id: 12,
    name: "Matcha Japonés",
    desc: "Té verde matcha ceremonial con leche entera y miel.",
    emoji: "🍵",
    price: 6200,
    category: "especial",
  },
];

// ===== STATE =====
let cart = [];
let activeFilter = "all";

// ===== DOM REFS =====
const catalogEl   = document.getElementById("catalog");
const cartCount   = document.getElementById("cartCount");
const cartItems   = document.getElementById("cartItems");
const cartTotal   = document.getElementById("cartTotal");
const cartFooter  = document.getElementById("cartFooter");
const cartSidebar = document.getElementById("cartSidebar");
const overlay     = document.getElementById("overlay");
const orderModal  = document.getElementById("orderModal");

// ===== RENDER CATALOG =====
function renderCatalog() {
  const list = activeFilter === "all"
    ? flavors
    : flavors.filter(f => f.category === activeFilter);

  catalogEl.innerHTML = "";

  list.forEach(flavor => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-img">${flavor.emoji}</div>
      <div class="card-body">
        <span class="card-tag tag-${flavor.category}">${flavor.category}</span>
        <h3 class="card-name">${flavor.name}</h3>
        <p class="card-desc">${flavor.desc}</p>
        <div class="card-footer">
          <span class="card-price">${formatPrice(flavor.price)}</span>
          <button class="add-btn" data-id="${flavor.id}">+ Agregar</button>
        </div>
      </div>
    `;
    catalogEl.appendChild(card);
  });
}

// ===== FORMAT PRICE =====
function formatPrice(amount) {
  return "$" + amount.toLocaleString("es-CO");
}

// ===== RENDER CART =====
function renderCart() {
  cartCount.textContent = cart.reduce((acc, i) => acc + i.qty, 0);

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-msg">Tu carrito está vacío 🍦</p>';
    cartFooter.style.display = "none";
    return;
  }

  cartFooter.style.display = "block";

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="ci-emoji">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">${formatPrice(item.price)} c/u</div>
      </div>
      <div class="ci-controls">
        <button class="ci-btn" data-action="dec" data-id="${item.id}">−</button>
        <span class="ci-qty">${item.qty}</span>
        <button class="ci-btn" data-action="inc" data-id="${item.id}">+</button>
      </div>
    </div>
  `).join("");

  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  cartTotal.textContent = formatPrice(total);
}

// ===== ADD TO CART =====
function addToCart(id) {
  const flavor = flavors.find(f => f.id === id);
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...flavor, qty: 1 });
  }

  renderCart();
  openCart();
}

// ===== CHANGE QTY =====
function changeQty(id, action) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  if (action === "inc") {
    item.qty += 1;
  } else {
    item.qty -= 1;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  }

  renderCart();
}

// ===== OPEN / CLOSE CART =====
function openCart() {
  cartSidebar.classList.add("open");
  overlay.classList.add("visible");
}

function closeCart() {
  cartSidebar.classList.remove("open");
  overlay.classList.remove("visible");
}

// ===== CONFIRM ORDER =====
function confirmOrder() {
  cart = [];
  renderCart();
  closeCart();
  orderModal.classList.add("visible");
}

// ===== EVENT LISTENERS =====

// Filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderCatalog();
  });
});

// Add to cart (delegation)
catalogEl.addEventListener("click", e => {
  const btn = e.target.closest(".add-btn");
  if (btn) addToCart(Number(btn.dataset.id));
});

// Cart item controls (delegation)
cartItems.addEventListener("click", e => {
  const btn = e.target.closest(".ci-btn");
  if (btn) changeQty(Number(btn.dataset.id), btn.dataset.action);
});

// Open/close cart
document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// Order button
document.getElementById("orderBtn").addEventListener("click", confirmOrder);

// Modal close
document.getElementById("modalClose").addEventListener("click", () => {
  orderModal.classList.remove("visible");
});

// ===== INIT =====
renderCatalog();
renderCart();
