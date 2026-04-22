const state = {
  data: null,
  category: "All",
  cart: []
};

const els = {};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  cacheElements();
  bindStaticEvents();

  try {
    const response = await fetch("data/restaurant.json");
    state.data = await response.json();
    hydrateSite(state.data);
    renderCategories();
    renderMenu();
    renderOffers();
    renderBenefits();
    renderReviews();
    renderCart();
  } catch (error) {
    console.error("Could not load restaurant config", error);
    document.body.insertAdjacentHTML("afterbegin", "<p class='config-error'>Restaurant content could not be loaded.</p>");
  } finally {
    els.loader.classList.add("is-hidden");
  }

  revealOnScroll();
}

function cacheElements() {
  els.loader = document.getElementById("loader");
  els.navToggle = document.querySelector(".nav-toggle");
  els.navLinks = document.getElementById("navLinks");
  els.themeToggle = document.querySelector(".theme-toggle");
  els.categoryTabs = document.getElementById("categoryTabs");
  els.menuGrid = document.getElementById("menuGrid");
  els.offerGrid = document.getElementById("offerGrid");
  els.benefitGrid = document.getElementById("benefitGrid");
  els.reviewGrid = document.getElementById("reviewGrid");
  els.cartDrawer = document.getElementById("cartDrawer");
  els.openCart = document.getElementById("openCart");
  els.closeCart = document.getElementById("closeCart");
  els.cartItems = document.getElementById("cartItems");
  els.cartTotal = document.getElementById("cartTotal");
  els.cartCount = document.getElementById("cartCount");
  els.checkoutWhatsapp = document.getElementById("checkoutWhatsapp");
  els.checkoutCall = document.getElementById("checkoutCall");
  els.customerName = document.getElementById("customerName");
  els.orderNote = document.getElementById("orderNote");
}

function bindStaticEvents() {
  els.navToggle.addEventListener("click", () => {
    const isOpen = els.navLinks.classList.toggle("is-open");
    els.navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      els.navLinks.classList.remove("is-open");
      els.navToggle.setAttribute("aria-expanded", "false");
    });
  });

  els.themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  els.openCart.addEventListener("click", openCart);
  els.closeCart.addEventListener("click", closeCart);
  els.cartDrawer.addEventListener("click", (event) => {
    if (event.target === els.cartDrawer) closeCart();
  });
  els.checkoutWhatsapp.addEventListener("click", sendCartToWhatsapp);
}

function hydrateSite(data) {
  document.title = `${data.name} | ${data.slogan}`;
  document.querySelector('meta[name="description"]').setAttribute("content", data.heroCopy);
  document.querySelectorAll("[data-restaurant-name]").forEach((el) => {
    el.textContent = data.name;
  });

  setText("heroEyebrow", data.heroEyebrow);
  setText("heroSlogan", data.slogan);
  setText("heroCopy", data.heroCopy);
  setText("heroDeal", data.heroDeal);
  setText("address", data.address);
  setText("hours", data.hours);
  setText("quickPhone", data.phone);
  setText("footerText", `${data.slogan}. Order online, on WhatsApp, or visit us today.`);

  document.getElementById("heroImage").src = data.heroImage;
  document.getElementById("heroImage").alt = `${data.name} featured food`;

  const whatsappUrl = getWhatsappUrl(`Hi ${data.name}, I want to place an order.`);
  const callUrl = `tel:${data.phone}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.mapQuery || data.address)}`;
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(data.mapQuery || data.address)}&output=embed`;

  ["heroWhatsapp", "quickWhatsapp", "locationWhatsapp", "floatWhatsapp"].forEach((id) => {
    document.getElementById(id).href = whatsappUrl;
  });
  ["quickCall", "phoneLink", "checkoutCall", "floatCall"].forEach((id) => {
    document.getElementById(id).href = callUrl;
  });
  document.getElementById("phoneLink").textContent = data.phone;
  document.getElementById("directionsLink").href = mapUrl;
  document.getElementById("mapFrame").src = embedUrl;
  document.getElementById("instagramLink").href = data.social.instagram;
  document.getElementById("facebookLink").href = data.social.facebook;
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function renderCategories() {
  const categories = ["All", ...state.data.categories];
  els.categoryTabs.innerHTML = categories.map((category) => `
    <button class="category-tab ${category === state.category ? "is-active" : ""}" type="button" role="tab" aria-selected="${category === state.category}" data-category="${category}">
      ${category}
    </button>
  `).join("");

  els.categoryTabs.querySelectorAll(".category-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.category = tab.dataset.category;
      renderCategories();
      renderMenu();
    });
  });
}

function renderMenu() {
  const items = state.category === "All"
    ? state.data.menu
    : state.data.menu.filter((item) => item.category === state.category);

  els.menuGrid.innerHTML = items.map((item) => `
    <article class="menu-card">
      <div class="menu-image">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        ${item.popular ? "<span class='badge'>🔥 Popular</span>" : ""}
      </div>
      <div class="menu-body">
        <div class="menu-top">
          <h3>${item.name}</h3>
          <span class="price">${formatPrice(item.price)}</span>
        </div>
        <p>${item.description}</p>
        <div class="menu-actions">
          <button class="btn btn-primary" type="button" data-add="${item.name}">Add to Cart</button>
          <a class="btn btn-secondary" href="${getWhatsappUrl(`Hi ${state.data.name}, I want to order ${item.name}.`)}" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
    </article>
  `).join("");

  els.menuGrid.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.add));
  });
}

function renderOffers() {
  els.offerGrid.innerHTML = state.data.offers.map((offer) => `
    <article class="offer-card">
      <span class="offer-tag">${offer.tag}</span>
      <h3>${offer.title}</h3>
      <p>${offer.description}</p>
      <strong class="offer-price">${offer.price}</strong>
    </article>
  `).join("");
}

function renderBenefits() {
  els.benefitGrid.innerHTML = state.data.benefits.map((benefit) => `
    <article class="benefit-card">
      <div class="benefit-icon">${benefit.icon}</div>
      <h3>${benefit.title}</h3>
      <p>${benefit.text}</p>
    </article>
  `).join("");
}

function renderReviews() {
  els.reviewGrid.innerHTML = state.data.reviews.map((review) => `
    <article class="review-card">
      <div class="stars">${"★".repeat(review.rating)}</div>
      <p>"${review.text}"</p>
      <strong>${review.name}</strong>
    </article>
  `).join("");
}

function addToCart(name) {
  const item = state.data.menu.find((entry) => entry.name === name);
  const existing = state.cart.find((entry) => entry.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ ...item, qty: 1 });
  }

  renderCart();
  openCart();
}

function updateQty(name, change) {
  const item = state.cart.find((entry) => entry.name === name);
  if (!item) return;
  item.qty += change;
  state.cart = state.cart.filter((entry) => entry.qty > 0);
  renderCart();
}

function renderCart() {
  const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const total = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  els.cartCount.textContent = totalQty;
  els.cartTotal.textContent = formatPrice(total);

  if (!state.cart.length) {
    els.cartItems.innerHTML = "<p>Your cart is empty. Add a craving from the menu.</p>";
    return;
  }

  els.cartItems.innerHTML = state.cart.map((item) => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <p>${formatPrice(item.price)} each</p>
      </div>
      <div class="qty-controls" aria-label="Quantity controls for ${item.name}">
        <button type="button" data-dec="${item.name}" aria-label="Decrease ${item.name}">−</button>
        <strong>${item.qty}</strong>
        <button type="button" data-inc="${item.name}" aria-label="Increase ${item.name}">+</button>
      </div>
    </div>
  `).join("");

  els.cartItems.querySelectorAll("[data-dec]").forEach((button) => {
    button.addEventListener("click", () => updateQty(button.dataset.dec, -1));
  });
  els.cartItems.querySelectorAll("[data-inc]").forEach((button) => {
    button.addEventListener("click", () => updateQty(button.dataset.inc, 1));
  });
}

function openCart() {
  els.cartDrawer.classList.add("is-open");
  els.cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  els.cartDrawer.classList.remove("is-open");
  els.cartDrawer.setAttribute("aria-hidden", "true");
}

function sendCartToWhatsapp() {
  if (!state.cart.length) {
    window.open(getWhatsappUrl(`Hi ${state.data.name}, I want to place an order.`), "_blank", "noopener");
    return;
  }

  const name = els.customerName.value.trim();
  const note = els.orderNote.value.trim();
  const lines = state.cart.map((item) => `${item.qty} x ${item.name} - ${formatPrice(item.price * item.qty)}`);
  const total = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const message = [
    `Hi ${state.data.name}, I want to order:`,
    ...lines,
    `Total: ${formatPrice(total)}`,
    name ? `Name: ${name}` : "",
    note ? `Note: ${note}` : ""
  ].filter(Boolean).join("\n");

  window.open(getWhatsappUrl(message), "_blank", "noopener");
}

function getWhatsappUrl(message) {
  const phone = state.data?.whatsapp || "";
  const cleanPhone = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

function formatPrice(value) {
  return `${state.data.currency}${Number(value).toFixed(2)}`;
}

function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".section-reveal").forEach((section) => observer.observe(section));
}
