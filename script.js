
"use strict";

const products = [
  { id: 1, name: "Business Laptop", category: "Electronics", price: 45999, emoji: "💻", rating: "★★★★★", description: "Reliable laptop for everyday office work." },
  { id: 2, name: "Wireless Headphones", category: "Accessories", price: 1499, emoji: "🎧", rating: "★★★★☆", description: "Comfortable headphones for calls." },
  { id: 3, name: "Office Chair", category: "Furniture", price: 5999, emoji: "🪑", rating: "★★★★★", description: "Comfortable seating for your workspace." },
  { id: 4, name: "Notebook Pack", category: "Office", price: 299, emoji: "📚", rating: "★★★★☆", description: "Notebooks for meetings and notes." },
  { id: 5, name: "Wireless Mouse", category: "Accessories", price: 699, emoji: "🖱️", rating: "★★★★☆", description: "A practical mouse for daily computing." },
  { id: 6, name: "Office Desk", category: "Furniture", price: 7999, emoji: "🪵", rating: "★★★★★", description: "A spacious desk for your workplace." },
  { id: 7, name: "Laser Printer", category: "Electronics", price: 12999, emoji: "🖨️", rating: "★★★★☆", description: "A printer for everyday documents." },
  { id: 8, name: "Stationery Kit", category: "Office", price: 499, emoji: "✏️", rating: "★★★★★", description: "Pens and stationery for your team." },
  { id: 9, name: "USB-C Hub", category: "Accessories", price: 1199, emoji: "🔌", rating: "★★★★☆", description: "Connect useful devices to your computer." },
  { id: 10, name: "Desk Lamp", category: "Office", price: 899, emoji: "💡", rating: "★★★★☆", description: "Brighten up your workspace." },
  { id: 11, name: "Desktop Monitor", category: "Electronics", price: 10999, emoji: "🖥️", rating: "★★★★★", description: "A larger display for productive work." },
  { id: 12, name: "Storage Organizer", category: "Furniture", price: 1499, emoji: "🗄️", rating: "★★★★☆", description: "Keep your workplace organized." }
];

const $ = id => document.getElementById(id);
const cart = new Map();

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(value);
}

function renderProducts() {
  const query = $("searchInput").value.trim().toLowerCase();
  const category = $("categorySelect").value;

  const filtered = products.filter(product => {
    const matchesCategory = category === "all" || product.category === category;
    const text = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    return matchesCategory && text.includes(query);
  });

  const grid = $("productGrid");
  grid.replaceChildren();
  $("emptyMessage").hidden = filtered.length !== 0;

  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("div");
    image.className = "product-image";
    image.textContent = product.emoji;
    image.setAttribute("aria-hidden", "true");

    const categoryLabel = document.createElement("small");
    categoryLabel.className = "muted";
    categoryLabel.textContent = product.category;

    const name = document.createElement("h3");
    name.textContent = product.name;

    const description = document.createElement("p");
    description.className = "description";
    description.textContent = product.description;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = money(product.price);

    const rating = document.createElement("p");
    rating.className = "rating";
    rating.textContent = product.rating;

    const button = document.createElement("button");
    button.className = "add-button";
    button.type = "button";
    button.dataset.add = product.id;
    button.textContent = "Add to cart +";

    card.append(image, categoryLabel, name, description, price, rating, button);
    grid.appendChild(card);
  });

  $("resultCount").textContent =
    `${filtered.length} product${filtered.length === 1 ? "" : "s"}`;
}

function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  $("cartMessage").textContent = "Product added to cart.";
  renderCart();
}

function changeQuantity(id, amount) {
  const quantity = (cart.get(id) || 0) + amount;
  if (quantity <= 0) cart.delete(id);
  else cart.set(id, quantity);
  renderCart();
}

function renderCart() {
  const container = $("cartItems");
  container.replaceChildren();

  let count = 0;
  let total = 0;

  cart.forEach((quantity, id) => {
    const product = products.find(item => item.id === id);
    if (!product) return;

    count += quantity;
    total += product.price * quantity;

    const row = document.createElement("div");
    row.className = "cart-row";

    const emoji = document.createElement("span");
    emoji.className = "cart-emoji";
    emoji.textContent = product.emoji;

    const info = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = product.name;
    const price = document.createElement("p");
    price.className = "muted";
    price.textContent = `${money(product.price)} each`;
    info.append(name, price);

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.dataset.change = "-1";
    minus.dataset.id = id;
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Decrease quantity");

    const quantityText = document.createElement("span");
    quantityText.textContent = quantity;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.dataset.change = "1";
    plus.dataset.id = id;
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Increase quantity");

    controls.append(minus, quantityText, plus);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.dataset.remove = id;
    remove.textContent = "Remove";

    row.append(emoji, info, controls, remove);
    container.appendChild(row);
  });

  if (cart.size === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Your cart is empty. Add products to get started.";
    container.appendChild(empty);
  }

  $("cartCount").textContent = count;
  $("cartTotal").textContent = money(total);
}

$("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  renderProducts();
  $("products").scrollIntoView({ behavior: "smooth" });
});

$("searchInput").addEventListener("input", renderProducts);
$("categorySelect").addEventListener("change", renderProducts);

document.querySelectorAll("[data-category]").forEach(button => {
  button.addEventListener("click", () => {
    $("categorySelect").value = button.dataset.category;
    $("searchInput").value = "";
    renderProducts();
    $("products").scrollIntoView({ behavior: "smooth" });
  });
});

$("productGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

$("cartItems").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.change) {
    changeQuantity(Number(button.dataset.id), Number(button.dataset.change));
  } else if (button.dataset.remove) {
    cart.delete(Number(button.dataset.remove));
    $("cartMessage").textContent = "Product removed from cart.";
    renderCart();
  }
});

$("cartBtn").addEventListener("click", () => {
  $("cartSection").scrollIntoView({ behavior: "smooth" });
});

$("pinForm").addEventListener("submit", event => {
  event.preventDefault();
  const pin = $("pincode").value.trim();

  if (!/^[1-9][0-9]{5}$/.test(pin)) {
    $("pinMessage").textContent = "Please enter a valid 6-digit Indian PIN code.";
    $("pinMessage").style.color = "red";
  } else {
    $("pinMessage").textContent =
      `PIN ${pin} format is valid. Actual delivery availability is not connected.`;
    $("pinMessage").style.color = "green";
  }
});

$("checkoutBtn").addEventListener("click", () => {
  $("cartMessage").textContent = cart.size === 0
    ? "Your cart is empty. Add a product first."
    : "Demo checkout only: no payment or order is processed.";
});

// Automatically show products as soon as the page loads.
renderProducts();
renderCart();
