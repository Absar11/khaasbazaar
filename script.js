/*
  Trending Bazaar - Vanilla JavaScript
*/
const BUSINESS_WHATSAPP = "919580966294"; // Replace with your WhatsApp number, e.g. 919876543210

const state = { cart: JSON.parse(localStorage.getItem("tbCart") || "[]"), wishlist: JSON.parse(localStorage.getItem("tbWishlist") || "[]"), activeProduct: null, activeImageIndex: 0, activeVariantIndex: 0 };




const $ = id => document.getElementById(id);
const els = {
  trendingGrid: $("trendingGrid"), productGrid: $("productGrid"), categoryList: $("categoryList"),
  categoryFilter: $("categoryFilter"), cartButton: $("cartButton"), cartCount: $("cartCount"),
  cartDrawer: $("cartDrawer"), drawerBackdrop: $("drawerBackdrop"), closeCart: $("closeCart"),
  cartItems: $("cartItems"), cartTotal: $("cartTotal"), proceedButton: $("proceedButton"),
  productModal: $("productModal"), productModalContent: $("productModalContent"),
  checkoutModal: $("checkoutModal"), checkoutForm: $("checkoutForm"),
  policyModal: $("policyModal"), policyTitle: $("policyTitle"), policyContent: $("policyContent"),
  toast: $("toast"),
  wishlistDrawer: $("wishlistDrawer"), closeWishlist: $("closeWishlist"), wishlistItems: $("wishlistItems"), wishlistButton: $("wishlistButton")
};

function esc(v) {
  return String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function price(v) { return `₹${Number(v).toLocaleString("en-IN")}`; }
function discount(mrp, selling) { return mrp && selling < mrp ? Math.round(((mrp - selling) / mrp) * 100) : 0; }
function productById(id) { return products.find(p => p.id === id); }
function variantPrice(p, v) { return v ? Number(v.price) : Number(p.sellingPrice); }
function stock(p, v) { return v ? v.stockStatus : p.stockStatus; }
function images(p, v) { return v?.images?.length ? v.images : p.images; }

function card(p) {
  const off = discount(p.mrp, p.sellingPrice), out = p.stockStatus !== "in-stock", isWish = state.wishlist.includes(p.id);
  return `<article class="product-card">
    <button class="wishlist-btn ${isWish ? "active" : ""}" data-wishlist="${esc(p.id)}" type="button" aria-label="Wishlist">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="${isWish ? "#ff4757" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
    </button>
    <button class="product-image-button" data-product="${esc(p.id)}" type="button">
      <img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy">
      <span class="free-badge">${p.deliveryCharge ? `🚚 +₹${p.deliveryCharge} Delivery` : `🚚 Free Delivery`}</span>
      <span class="stock-badge ${out ? "out" : ""}">${out ? "Out of Stock" : "In Stock"}</span>
    </button>
    <div class="product-body">
      <button class="product-name-button" data-product="${esc(p.id)}" type="button">${esc(p.name)}</button>
      <div class="price-row"><strong class="sale-price">${price(p.sellingPrice)}</strong><span class="mrp">${price(p.mrp)}</span>${off ? `<span class="discount">${off}% OFF</span>` : ""}</div>
      <div class="card-actions"><button class="primary-button full-width" data-add="${esc(p.id)}" type="button" ${out ? "disabled" : ""}>${out ? "Out of Stock" : "Add to Cart"}</button></div>
    </div>
  </article>`;
}

function render() {
  const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
  $("categoryList").innerHTML = cats.map(c => `<button class="category-chip" data-category="${esc(c)}" type="button">${esc(c)}</button>`).join("");
  $("categoryFilter").innerHTML = `<option value="all">All Categories</option>` + cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
  $("trendingGrid").innerHTML = products.filter(p => p.trending).map(card).join("");
  renderProducts();
}
function renderProducts() {
  const c = $("categoryFilter").value;
  const list = c === "all" ? products : products.filter(p => p.category === c);
  $("productGrid").innerHTML = list.map(card).join("");
  $("noProducts").classList.toggle("hidden", !!list.length);
}

function openModal(el) { el.classList.remove("hidden"); document.body.classList.add("no-scroll"); }
function closeModal(el) { el.classList.add("hidden"); if (!$("cartDrawer").classList.contains("open")) document.body.classList.remove("no-scroll"); }
function openCart() { $("cartDrawer").classList.add("open"); $("drawerBackdrop").classList.remove("hidden"); document.body.classList.add("no-scroll"); }
function closeCart() { $("cartDrawer").classList.remove("open"); $("drawerBackdrop").classList.add("hidden"); document.body.classList.remove("no-scroll"); }

function openProduct(id) {
  state.activeProduct = productById(id); state.activeImageIndex = 0; state.activeVariantIndex = 0; drawProductModal(); openModal($("productModal"));
}
function drawProductModal() {
  const p = state.activeProduct, vs = p.variants || [], v = vs[state.activeVariantIndex] || null, imgs = images(p, v), sp = variantPrice(p, v), out = stock(p, v) !== "in-stock";
  $("productModalContent").innerHTML = `<div class="product-modal-content">
    <div class="modal-gallery"><img class="modal-main-image" id="modalMainImage" src="${esc(imgs[state.activeImageIndex])}" alt="${esc(p.name)}">
      ${imgs.length > 1 ? `<div class="gallery-nav"><button data-gallery="prev" type="button">‹</button><button data-gallery="next" type="button">›</button></div>
      <div class="thumbnails">${imgs.map((im, i) => `<button class="thumbnail ${i === state.activeImageIndex ? "active" : ""}" data-image-index="${i}" type="button"><img src="${esc(im)}" alt=""></button>`).join("")}</div>` : ""}
    </div>
    <div class="modal-product-info"><p class="eyebrow">${esc(p.category || "Product")}</p><h2>${esc(p.name)}</h2>
      <div class="price-row"><strong class="sale-price">${price(sp)}</strong><span class="mrp">${price(p.mrp)}</span>${discount(p.mrp, sp) ? `<span class="discount">${discount(p.mrp, sp)}% OFF</span>` : ""}</div>
      <p class="free-delivery-note">${p.deliveryCharge ? `🚚 +₹${p.deliveryCharge} Delivery` : `🚚 Free Delivery`}</p><p class="modal-description">${esc(p.description || "")}</p>
      ${Object.keys(p.specifications || {}).length ? `<div class="specifications">${Object.entries(p.specifications).map(([k, val]) => `<div class="spec-row"><span>${esc(k)}</span><strong>${esc(val)}</strong></div>`).join("")}</div>` : ""}
      ${vs.length ? `<div class="variant-section"><label>Choose Variant</label><select class="variant-select" id="variantSelect">${vs.map((x, i) => `<option value="${i}" ${i === state.activeVariantIndex ? "selected" : ""}>${esc(x.name)} — ${price(x.price)}</option>`).join("")}</select></div>` : ""}
      <div class="card-actions"><div class="quantity-control"><button data-modal-qty="-1" type="button">−</button><span id="modalQuantity">1</span><button data-modal-qty="1" type="button">+</button></div>
      <button class="primary-button" id="modalAddButton" type="button" ${out ? "disabled" : ""}>${out ? "Out of Stock" : "Add to Cart"}</button></div>
    </div></div>`;
  bindProductEvents();
}
function bindProductEvents() {
  const p = state.activeProduct, select = $("variantSelect");
  document.querySelectorAll("[data-gallery]").forEach(b => b.onclick = () => { const vs = p.variants || [], v = vs[Number(select?.value || 0)] || null, ims = images(p, v); state.activeImageIndex = (state.activeImageIndex + (b.dataset.gallery === "next" ? 1 : -1) + ims.length) % ims.length; drawProductModal(); if (select) $("variantSelect").value = select.value; });
  document.querySelectorAll("[data-image-index]").forEach(b => b.onclick = () => { state.activeImageIndex = Number(b.dataset.imageIndex); const vs = p.variants || [], v = vs[Number(select?.value || 0)] || null; $("modalMainImage").src = images(p, v)[state.activeImageIndex]; });
  select?.addEventListener("change", () => { state.activeVariantIndex = Number(select.value); state.activeImageIndex = 0; drawProductModal(); });
  document.querySelectorAll("[data-modal-qty]").forEach(b => b.onclick = () => { $("modalQuantity").textContent = Math.max(1, Number($("modalQuantity").textContent) + Number(b.dataset.modalQty)); });
  $("modalAddButton")?.addEventListener("click", () => { const vs = p.variants || [], v = vs[Number($("variantSelect")?.value || 0)] || null; addToCart(p, v, Number($("modalQuantity").textContent || 1)); closeModal($("productModal")); openCart(); });
}

function addToCart(p, v = null, q = 1) {
  const key = `${p.id}__${v?.name || "default"}`, found = state.cart.find(x => x.key === key);
  if (found) found.quantity += q;
  else state.cart.push({ key, productId: p.id, variantName: v?.name || null, quantity: q, price: variantPrice(p, v), image: images(p, v)[0], productName: p.name, deliveryCharge: p.deliveryCharge || 0 });
  renderCart(); toast("Added to cart");
}
function renderCart() {
  localStorage.setItem("tbCart", JSON.stringify(state.cart));
  const count = state.cart.reduce((s, x) => s + x.quantity, 0);
  const totalItemsPrice = state.cart.reduce((s, x) => s + x.price * x.quantity, 0);
  const totalDelivery = state.cart.reduce((s, x) => s + (x.deliveryCharge || 0) * x.quantity, 0);
  const total = totalItemsPrice + totalDelivery;
  $("cartCount").textContent = count; $("cartTotal").textContent = price(total); $("proceedButton").disabled = !state.cart.length;
  $("cartItems").innerHTML = state.cart.length ? state.cart.map(x => `<div class="cart-item"><img class="cart-item-image" src="${esc(x.image)}" alt="${esc(x.productName)}"><div><p class="cart-item-name">${esc(x.productName)}</p>${x.variantName ? `<div class="cart-item-variant">Variant: ${esc(x.variantName)}</div>` : ""}<div class="cart-item-price">${price(x.price)} each</div><div class="cart-item-actions"><div class="quantity-control mini-quantity"><button data-cart-qty="-1" data-key="${esc(x.key)}" type="button">−</button><span>${x.quantity}</span><button data-cart-qty="1" data-key="${esc(x.key)}" type="button">+</button></div><button class="remove-item" data-remove="${esc(x.key)}" type="button">Remove</button></div></div><strong>${price(x.price * x.quantity)}</strong></div>`).join("") : `<div class="empty-cart">Your cart is empty.</div>`;
}
function changeQty(key, d) { const x = state.cart.find(i => i.key === key); if (!x) return; x.quantity += d; if (x.quantity <= 0) state.cart = state.cart.filter(i => i.key !== key); renderCart(); }
function removeItem(key) { state.cart = state.cart.filter(i => i.key !== key); renderCart(); }

function toggleWishlist(id) {
  const idx = state.wishlist.indexOf(id);
  if (idx > -1) state.wishlist.splice(idx, 1);
  else state.wishlist.push(id);
  localStorage.setItem("tbWishlist", JSON.stringify(state.wishlist));
  render();
  if (els.wishlistDrawer.classList.contains("open")) renderWishlist();
}
function renderWishlist() {
  const items = state.wishlist.map(id => productById(id)).filter(Boolean);
  els.wishlistItems.innerHTML = items.length ? items.map(x => `<div class="cart-item"><img class="cart-item-image" src="${esc(x.images[0])}" alt="${esc(x.name)}"><div><p class="cart-item-name">${esc(x.name)}</p><div class="cart-item-price">${price(x.sellingPrice)}</div><div class="cart-item-actions"><button class="primary-button" style="padding:4px 8px; font-size:12px; margin-right:8px;" data-add="${esc(x.id)}" type="button">Add to Cart</button><button class="remove-item" data-wishlist="${esc(x.id)}" type="button">Remove</button></div></div></div>`).join("") : `<div class="empty-cart">Your wishlist is empty.</div>`;
}
function openWishlist() { els.wishlistDrawer.classList.add("open"); els.drawerBackdrop.classList.remove("hidden"); document.body.classList.add("no-scroll"); renderWishlist(); }
function closeWishlist() { els.wishlistDrawer.classList.remove("open"); if (!els.cartDrawer.classList.contains("open")) { els.drawerBackdrop.classList.add("hidden"); document.body.classList.remove("no-scroll"); } }

function policy(type) {
  const data = {
    terms: ["Terms & Conditions", "<p>Submitting an order creates an order request. We will contact you on WhatsApp to confirm availability, payment and the order.</p><h3>Pricing</h3><p>Prices shown are the customer-facing selling prices at the time of the order request.</p>"],
    privacy: ["Privacy Policy", "<p>We collect the information entered at checkout to process and communicate about your order request.</p><h3>Information</h3><p>Name, mobile/WhatsApp number, complete address and pincode.</p>"],
    returns: ["Return / Replacement Policy", "<p>Products are not eligible for return or refund.</p><h3>Damaged or Defective Product</h3><p>Contact us on WhatsApp as soon as possible. Replacement is handled subject to verification and availability.</p>"]
  }[type];
  $("policyTitle").textContent = data[0]; $("policyContent").innerHTML = data[1]; openModal($("policyModal"));
}
function orderId() { const n = Number(localStorage.getItem("tbOrderNo") || 1000) + 1; localStorage.setItem("tbOrderNo", n); return `ORD-${n}`; }
function submitOrder(e) {
  e.preventDefault();
  if (!state.cart.length) return;
  if (BUSINESS_WHATSAPP.includes("X")) { alert("Replace BUSINESS_WHATSAPP in script.js with the real WhatsApp number."); return; }
  const c = { name: $("customerName").value.trim(), phone: $("customerPhone").value.trim(), address: $("customerAddress").value.trim(), pincode: $("customerPincode").value.trim() };
  const lines = state.cart.map((x, i) => `${i + 1}. ${x.productName}${x.variantName ? ` (${x.variantName})` : ""} × ${x.quantity}\n   ${price(x.price * x.quantity)}`).join("\n\n");
  const totalItemsPrice = state.cart.reduce((s, x) => s + x.price * x.quantity, 0);
  const totalDelivery = state.cart.reduce((s, x) => s + (x.deliveryCharge || 0) * x.quantity, 0);
  const total = totalItemsPrice + totalDelivery;
  const date = new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const deliveryStr = totalDelivery > 0 ? `🚚 Delivery Charge: ${price(totalDelivery)}` : `🚚 Free Delivery`;
  const msg = `🛍️ NEW ORDER #${orderId()}\n\n👤 CUSTOMER\nName: ${c.name}\nMobile: ${c.phone}\n\n📦 ORDER\n${lines}\n\n💰 Items Total: ${price(totalItemsPrice)}\n${deliveryStr}\n💰 Grand Total: ${price(total)}\n\n📍 DELIVERY ADDRESS\n${c.address}\n${c.pincode}\n\n🕐 Order Time: ${date}\n\nPlease confirm my order and share payment details.`;
  state.cart = []; renderCart(); closeModal($("checkoutModal")); closeCart(); window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  setTimeout(() => alert("Order request received! We'll contact you on WhatsApp shortly to confirm your order and payment."), 300);
}
function toast(msg) { $("toast").textContent = msg; $("toast").classList.add("show"); clearTimeout(window.tbToast); window.tbToast = setTimeout(() => $("toast").classList.remove("show"), 1800); }

document.addEventListener("click", e => {
  const w = e.target.closest("[data-wishlist]"); if (w) { toggleWishlist(w.dataset.wishlist); return; }
  const p = e.target.closest("[data-product]"); if (p) { openProduct(p.dataset.product); return; }
  const a = e.target.closest("[data-add]"); if (a) { const p = productById(a.dataset.add); if (p) addToCart(p); return; }
  const c = e.target.closest("[data-category]"); if (c) { $("categoryFilter").value = c.dataset.category; renderProducts(); $("products").scrollIntoView({ behavior: "smooth" }); return; }
  const q = e.target.closest("[data-cart-qty]"); if (q) { changeQty(q.dataset.key, Number(q.dataset.cartQty)); return; }
  const r = e.target.closest("[data-remove]"); if (r) { removeItem(r.dataset.remove); return; }
  const pol = e.target.closest("[data-policy]"); if (pol) { policy(pol.dataset.policy); return; }
  const close = e.target.closest("[data-close]"); if (close) { if (close.dataset.close === "product") closeModal($("productModal")); if (close.dataset.close === "checkout") closeModal($("checkoutModal")); if (close.dataset.close === "policy") closeModal($("policyModal")); }
});
$("cartButton").onclick = openCart; $("closeCart").onclick = closeCart;
$("wishlistButton").onclick = openWishlist; $("closeWishlist").onclick = closeWishlist;
$("drawerBackdrop").onclick = () => { closeCart(); closeWishlist(); };
$("proceedButton").onclick = () => { if (state.cart.length) { closeCart(); openModal($("checkoutModal")); } };
$("checkoutForm").addEventListener("submit", submitOrder); $("categoryFilter").addEventListener("change", renderProducts);
render(); renderCart();

/* Hero Carousel Logic */
function initCarousel() {
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".indicator");
  if (!slides.length) return;
  
  let currentSlide = 0;
  let carouselInterval;
  
  const showSlide = (index) => {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
    currentSlide = index;
  };
  
  const nextSlide = () => showSlide((currentSlide + 1) % slides.length);
  
  const startAutoplay = () => {
    clearInterval(carouselInterval);
    carouselInterval = setInterval(nextSlide, 5000); // 5 seconds interval
  };
  
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.slide));
      startAutoplay(); // reset interval on click
    });
  });
  
  startAutoplay();
}
initCarousel();
