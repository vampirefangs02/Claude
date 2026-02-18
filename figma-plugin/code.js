// ─── Dulce Frío – Figma Plugin ────────────────────────────────────────────────
// Genera los frames principales del app de helados en Figma.
// ──────────────────────────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 280, height: 380 });

// ===== DESIGN TOKENS =====
const C = {
  pink:     { r: 1,    g: 0.42, b: 0.62 },   // #ff6b9d
  purple:   { r: 0.47, g: 0.20, b: 0.95 },   // #7c3aed
  purpleL:  { r: 0.66, g: 0.33, b: 0.97 },   // #a855f7
  teal:     { r: 0.08, g: 0.72, b: 0.65 },   // #14b8a6
  yellow:   { r: 0.98, g: 0.80, b: 0.08 },   // #facc15
  bg:       { r: 1,    g: 0.97, b: 0.94 },   // #fff7f0
  dark:     { r: 0.12, g: 0.12, b: 0.18 },   // #1e1e2e
  card:     { r: 1,    g: 1,    b: 1    },   // #ffffff
  muted:    { r: 0.42, g: 0.45, b: 0.50 },   // #6b7280
  gray50:   { r: 0.98, g: 0.98, b: 0.99 },   // #fafafa
  gray100:  { r: 0.95, g: 0.96, b: 0.97 },   // #f3f4f6
  tagYellow:{ r: 0.99, g: 0.91, b: 0.54 },
  tagGreen: { r: 0.73, g: 0.97, b: 0.75 },
  tagPurple:{ r: 0.91, g: 0.83, b: 1.00 },
  white:    { r: 1,    g: 1,    b: 1    },
};

const FLAVORS = [
  { name: "Vainilla Clásica",  desc: "Cremosa vainilla de Madagascar con caramelo.",       emoji: "🍦", price: "$4.500", cat: "clasico"  },
  { name: "Chocolate Intenso", desc: "Chocolate oscuro belga 70% con chips de cacao.",     emoji: "🍫", price: "$5.000", cat: "clasico"  },
  { name: "Fresa Natural",     desc: "Fresas frescas de temporada con crema fresca.",       emoji: "🍓", price: "$4.800", cat: "frutal"   },
  { name: "Mango Tropical",    desc: "Pulpa de mango con toque de chile y limón.",          emoji: "🥭", price: "$5.200", cat: "frutal"   },
  { name: "Arcoíris Unicornio",desc: "Swirl de colores pastel con chispas de azúcar.",      emoji: "🌈", price: "$6.500", cat: "especial" },
  { name: "Oreo & Nutella",    desc: "Base de vainilla con Nutella y galleta Oreo.",        emoji: "🍪", price: "$6.800", cat: "especial" },
];

// ===== HELPERS =====
function rgb(c, a = 1) { return { type: "SOLID", color: c, opacity: a }; }

function grad(stops) {
  return {
    type: "GRADIENT_LINEAR",
    gradientStops: stops,
    gradientTransform: [[1, 0, 0], [0, 1, 0]],
  };
}

function rect(w, h, fills = []) {
  const r = figma.createRectangle();
  r.resize(w, h);
  r.fills = fills;
  return r;
}

async function text(content, opts = {}) {
  await figma.loadFontAsync({ family: opts.family || "Inter", style: opts.style || "Regular" });
  const t = figma.createText();
  t.characters = content;
  t.fontSize    = opts.size   || 14;
  t.fontName    = { family: opts.family || "Inter", style: opts.style || "Regular" };
  if (opts.color) t.fills = [rgb(opts.color)];
  if (opts.align) t.textAlignHorizontal = opts.align;
  if (opts.width) { t.textAutoResize = "HEIGHT"; t.resize(opts.width, t.height); }
  return t;
}

function frame(w, h, name = "Frame") {
  const f = figma.createFrame();
  f.name   = name;
  f.resize(w, h);
  f.clipsContent = true;
  return f;
}

function place(node, x, y) { node.x = x; node.y = y; return node; }

function roundCorners(node, r) { node.cornerRadius = r; return node; }

// ===== BUILD HEADER =====
async function buildHeader(parent, w) {
  const h = frame(w, 64, "Header");
  h.fills = [grad([
    { position: 0, color: { ...C.pink,   a: 1 } },
    { position: 1, color: { ...C.purple, a: 1 } },
  ])];

  // Logo icon
  const logoIcon = await text("🍦", { size: 28, style: "Regular" });
  place(logoIcon, 24, 18);

  // Logo text
  const logoTxt = await text("Dulce Frío", { size: 20, style: "Bold", color: C.white });
  place(logoTxt, 62, 20);

  // Cart button background
  const cartBg = rect(90, 36, [rgb(C.white, 0.25)]);
  roundCorners(cartBg, 50);
  place(cartBg, w - 114, 14);

  // Cart label
  const cartTxt = await text("🛒  0", { size: 15, style: "Bold", color: C.white });
  place(cartTxt, w - 102, 22);

  h.appendChild(logoIcon);
  h.appendChild(logoTxt);
  h.appendChild(cartBg);
  h.appendChild(cartTxt);
  place(h, 0, 0);
  parent.appendChild(h);
  return h;
}

// ===== BUILD HERO =====
async function buildHero(parent, w, yOff) {
  const h = frame(w, 160, "Hero");
  h.fills = [grad([
    { position: 0,   color: { ...C.pink,   a: 1 } },
    { position: 0.5, color: { ...C.purple, a: 1 } },
    { position: 1,   color: { ...C.teal,   a: 1 } },
  ])];

  const title = await text("Los mejores helados de la ciudad", {
    size: 28, style: "Bold", color: C.white, align: "CENTER", width: w - 48,
  });
  place(title, 24, 40);

  const sub = await text("Sabores artesanales hechos con ingredientes naturales", {
    size: 15, style: "Regular", color: C.white, align: "CENTER", width: w - 48,
  });
  sub.opacity = 0.85;
  place(sub, 24, 82);

  h.appendChild(title);
  h.appendChild(sub);
  place(h, 0, yOff);
  parent.appendChild(h);
  return h;
}

// ===== BUILD FILTER BAR =====
async function buildFilters(parent, w, yOff) {
  const filters = ["Todos", "Clásicos", "Frutales", "Especiales"];
  let xCursor = 0;
  const container = frame(w, 44, "Filters");
  container.fills = [];

  for (let i = 0; i < filters.length; i++) {
    const label = filters[i];
    const isActive = i === 0;
    const btnW = label.length * 9 + 32;

    const bg = rect(btnW, 36, isActive ? [rgb(C.purple)] : []);
    if (!isActive) {
      bg.strokes = [rgb(C.purple)];
      bg.strokeWeight = 2;
    }
    roundCorners(bg, 50);
    place(bg, xCursor, 4);

    const lbl = await text(label, {
      size: 13, style: "SemiBold",
      color: isActive ? C.white : C.purple,
    });
    place(lbl, xCursor + 14, 14);

    container.appendChild(bg);
    container.appendChild(lbl);
    xCursor += btnW + 10;
  }

  place(container, 24, yOff);
  parent.appendChild(container);
  return container;
}

// ===== BUILD FLAVOR CARD =====
async function buildCard(flavor, x, y) {
  const cardW = 260;
  const cardH = 280;
  const card = frame(cardW, cardH, `Card – ${flavor.name}`);
  card.fills = [rgb(C.card)];
  roundCorners(card, 16);
  card.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.10 },
    offset: { x: 0, y: 4 },
    radius: 20,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  }];

  // Image area
  const imgBg = rect(cardW, 110, [grad([
    { position: 0, color: { r: 0.99, g: 0.95, b: 1.00, a: 1 } },
    { position: 1, color: { r: 1.00, g: 0.97, b: 0.94, a: 1 } },
  ])]);
  place(imgBg, 0, 0);

  const emoji = await text(flavor.emoji, { size: 52 });
  place(emoji, cardW / 2 - 26, 24);

  // Tag
  const tagColors = {
    clasico:  { bg: C.tagYellow, txt: { r: 0.57, g: 0.25, b: 0.05 } },
    frutal:   { bg: C.tagGreen,  txt: { r: 0.02, g: 0.37, b: 0.27 } },
    especial: { bg: C.tagPurple, txt: { r: 0.42, g: 0.13, b: 0.66 } },
  };
  const tc = tagColors[flavor.cat];
  const tagLabel = flavor.cat.charAt(0).toUpperCase() + flavor.cat.slice(1);
  const tagBg = rect(tagLabel.length * 7 + 20, 20, [rgb(tc.bg)]);
  roundCorners(tagBg, 50);
  place(tagBg, 16, 118);

  const tagTxt = await text(tagLabel.toUpperCase(), { size: 9, style: "Bold", color: tc.txt });
  place(tagTxt, 26, 123);

  // Name
  const name = await text(flavor.name, { size: 15, style: "Bold", color: C.dark, width: cardW - 32 });
  place(name, 16, 146);

  // Desc
  const desc = await text(flavor.desc, { size: 11, style: "Regular", color: C.muted, width: cardW - 32 });
  place(desc, 16, 170);

  // Price
  const price = await text(flavor.price, { size: 18, style: "Bold", color: C.purple });
  place(price, 16, 238);

  // Add button
  const btnW = 100;
  const addBg = rect(btnW, 36, [grad([
    { position: 0, color: { ...C.pink,   a: 1 } },
    { position: 1, color: { ...C.purple, a: 1 } },
  ])]);
  roundCorners(addBg, 50);
  place(addBg, cardW - btnW - 16, 232);

  const addTxt = await text("+ Agregar", { size: 12, style: "Bold", color: C.white });
  place(addTxt, cardW - btnW - 2, 242);

  card.appendChild(imgBg);
  card.appendChild(emoji);
  card.appendChild(tagBg);
  card.appendChild(tagTxt);
  card.appendChild(name);
  card.appendChild(desc);
  card.appendChild(price);
  card.appendChild(addBg);
  card.appendChild(addTxt);

  place(card, x, y);
  return card;
}

// ===== BUILD CART SIDEBAR =====
async function buildCart(parent, x, y) {
  const w = 340, h = 600;
  const sidebar = frame(w, h, "Cart Sidebar");
  sidebar.fills = [rgb(C.card)];
  roundCorners(sidebar, 16);
  sidebar.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.15 },
    offset: { x: -4, y: 0 },
    radius: 30,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  }];

  // Header
  const headerBg = rect(w, 64, [rgb(C.card)]);
  place(headerBg, 0, 0);
  const divider = rect(w, 1, [rgb(C.gray100)]);
  place(divider, 0, 63);

  const cartTitle = await text("Tu Pedido", { size: 18, style: "Bold", color: C.dark });
  place(cartTitle, 24, 22);

  const closeBg = rect(32, 32, [rgb(C.gray100)]);
  roundCorners(closeBg, 50);
  place(closeBg, w - 56, 16);
  const closeTxt = await text("✕", { size: 14, style: "Regular", color: C.muted });
  place(closeTxt, w - 46, 22);

  sidebar.appendChild(headerBg);
  sidebar.appendChild(divider);
  sidebar.appendChild(cartTitle);
  sidebar.appendChild(closeBg);
  sidebar.appendChild(closeTxt);

  // Cart items (2 sample items)
  const items = [
    { emoji: "🍦", name: "Vainilla Clásica",  price: "$4.500", qty: 2 },
    { emoji: "🍪", name: "Oreo & Nutella",    price: "$6.800", qty: 1 },
  ];

  let yItem = 80;
  for (const item of items) {
    const row = frame(w - 48, 60, `CartItem – ${item.name}`);
    row.fills = [rgb(C.gray50)];
    roundCorners(row, 12);

    const eml = await text(item.emoji, { size: 30 });
    place(eml, 12, 14);

    const nm = await text(item.name, { size: 13, style: "Bold", color: C.dark });
    place(nm, 56, 12);

    const pr = await text(item.price + " c/u", { size: 11, style: "Regular", color: C.muted });
    place(pr, 56, 32);

    // Controls
    const decBg = rect(28, 28, [rgb(C.tagPurple)]);
    roundCorners(decBg, 50);
    place(decBg, row.width - 90, 16);
    const decTxt = await text("−", { size: 14, style: "Bold", color: C.purple });
    place(decTxt, row.width - 82, 20);

    const qtyTxt = await text(String(item.qty), { size: 14, style: "Bold", color: C.dark });
    place(qtyTxt, row.width - 56, 20);

    const incBg = rect(28, 28, [rgb(C.tagPurple)]);
    roundCorners(incBg, 50);
    place(incBg, row.width - 38, 16);
    const incTxt = await text("+", { size: 14, style: "Bold", color: C.purple });
    place(incTxt, row.width - 30, 20);

    row.appendChild(eml);
    row.appendChild(nm);
    row.appendChild(pr);
    row.appendChild(decBg);
    row.appendChild(decTxt);
    row.appendChild(qtyTxt);
    row.appendChild(incBg);
    row.appendChild(incTxt);

    place(row, 24, yItem);
    sidebar.appendChild(row);
    yItem += 72;
  }

  // Footer
  const footerDivider = rect(w, 1, [rgb(C.gray100)]);
  place(footerDivider, 0, h - 110);

  const totalLabel = await text("Total:", { size: 15, style: "Regular", color: C.dark });
  place(totalLabel, 24, h - 96);

  const totalAmt = await text("$16.100", { size: 22, style: "Bold", color: C.purple });
  place(totalAmt, 90, h - 100);

  const orderBg = rect(w - 48, 48, [grad([
    { position: 0, color: { ...C.pink,   a: 1 } },
    { position: 1, color: { ...C.purple, a: 1 } },
  ])]);
  roundCorners(orderBg, 50);
  place(orderBg, 24, h - 66);

  const orderTxt = await text("Hacer Pedido", { size: 15, style: "Bold", color: C.white, align: "CENTER", width: w - 48 });
  place(orderTxt, 24, h - 50);

  sidebar.appendChild(footerDivider);
  sidebar.appendChild(totalLabel);
  sidebar.appendChild(totalAmt);
  sidebar.appendChild(orderBg);
  sidebar.appendChild(orderTxt);

  place(sidebar, x, y);
  parent.appendChild(sidebar);
  return sidebar;
}

// ===== BUILD CONFIRMATION MODAL =====
async function buildModal(parent, x, y) {
  const w = 360, h = 320;
  const modal = frame(w, h, "Modal – Confirmación");
  modal.fills = [rgb(C.card)];
  roundCorners(modal, 24);
  modal.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.20 },
    offset: { x: 0, y: 20 },
    radius: 60,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  }];

  const icon = await text("🎉", { size: 60 });
  place(icon, w / 2 - 30, 28);

  const title = await text("¡Pedido Confirmado!", {
    size: 24, style: "Bold", color: C.dark, align: "CENTER", width: w - 48,
  });
  place(title, 24, 108);

  const msg = await text("Tu helado está siendo preparado con mucho amor.", {
    size: 13, style: "Regular", color: C.muted, align: "CENTER", width: w - 48,
  });
  place(msg, 24, 144);

  const time = await text("Tiempo estimado: 10-15 min", {
    size: 13, style: "Regular", color: C.muted, align: "CENTER", width: w - 48,
  });
  place(time, 24, 168);

  const btnBg = rect(w - 80, 46, [grad([
    { position: 0, color: { ...C.pink,   a: 1 } },
    { position: 1, color: { ...C.purple, a: 1 } },
  ])]);
  roundCorners(btnBg, 50);
  place(btnBg, 40, 242);

  const btnTxt = await text("Hacer otro pedido", {
    size: 14, style: "Bold", color: C.white, align: "CENTER", width: w - 80,
  });
  place(btnTxt, 40, 256);

  modal.appendChild(icon);
  modal.appendChild(title);
  modal.appendChild(msg);
  modal.appendChild(time);
  modal.appendChild(btnBg);
  modal.appendChild(btnTxt);

  place(modal, x, y);
  parent.appendChild(modal);
  return modal;
}

// ===== MAIN SCREEN =====
async function buildHomeScreen() {
  const W = 390;  // iPhone 14 width
  const page = figma.currentPage;

  // ── Screen 1: Home ──────────────────────────────────────────────────────────
  const screen = frame(W, 844, "Screen – Home");
  screen.fills = [rgb(C.bg)];

  await buildHeader(screen, W);
  await buildHero(screen, W, 64);

  // Filters
  await buildFilters(screen, W, 252);

  // Cards grid (2 columns, 3 rows)
  const cardW = 170;
  const colGap = 12;
  let cardY = 308;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 2; col++) {
      const idx = row * 2 + col;
      if (idx >= FLAVORS.length) break;
      const cardX = 16 + col * (cardW + colGap);
      // Scale card to 170px wide
      const c = await buildCard(FLAVORS[idx], cardX, cardY);
      c.resize(cardW, 245);
      screen.appendChild(c);
    }
    cardY += 257;
  }

  place(screen, 0, 0);
  page.appendChild(screen);

  // ── Screen 2: Full card (expanded) ─────────────────────────────────────────
  const bigCard = await buildCard(FLAVORS[0], 0, 0);
  place(bigCard, W + 60, 0);
  page.appendChild(bigCard);

  // ── Screen 3: Cart open ─────────────────────────────────────────────────────
  await buildCart(page, W * 2 + 120, 0);

  // ── Screen 4: Confirmation modal ────────────────────────────────────────────
  await buildModal(page, W * 2 + 500, 262);

  // Zoom to fit
  figma.viewport.scrollAndZoomIntoView(page.children);
}

// ===== MESSAGE HANDLER =====
figma.ui.onmessage = async (msg) => {
  if (msg.type !== "generate") return;

  try {
    await buildHomeScreen();
    figma.ui.postMessage({ type: "done" });
  } catch (err) {
    figma.ui.postMessage({ type: "error", message: String(err) });
  }
};
