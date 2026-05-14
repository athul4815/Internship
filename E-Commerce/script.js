const products = [
  {
    id: 1,
    name: "Smartwatch",
    price: 2000,
    image: "https://zebronics.com/cdn/shop/products/Eternal-580CH-pic3.jpg?v=1665490500&width=1200",
    desc: "Feature-rich smartwatch with health tracking."
  },
  {
    id: 2,
    name: "Earbuds",
    price: 3500,
    image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR0CKBePvGNIWS2_0yYWbk-MCeYkSzup5PwNBvfTesPqSlFhdZMonUkOS_MR8x7fqrkZrSTQxkD56u6RgxGTzT-Qjw_nOhGirwfCymCcPZo8eWOENFOgc1a6tM",
    desc: "Noise cancelling earbuds with premium sound."
  },
  {
    id: 3,
    name: "Shoes",
    price: 4000,
    image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSFpXX3lM7w5VvAlrasOO6unxYx29IQo9FZg9OQvx5I-tJt9iAYG8NfUO3ivJw6uL54j3w8PNcJAnM2E4dosi6jgsTZdOuTYyRxASUoGoF5hjGN5rKC4ZWk0pU",
    desc: "Comfortable sports shoes for everyday use."
  }
];

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let count = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelectorAll(".cart").forEach(el => {
    el.textContent = `🛒 Cart (${count})`;
  });
}
updateCartCount();

if (document.getElementById("productContainer")) {
  renderProducts(products);
}

function renderProducts(list) {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  list.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <div class="img-box">
          <img src="${p.image}" alt="${p.name}">
        </div>

        <h3>${p.name}</h3>
        <p>₹${p.price}</p>

        <div class="btn-group">
          <button onclick="openProduct(${p.id})">View</button>
          <button onclick="quickAdd(${p.id})">Add</button>
        </div>
      </div>
    `;
  });
}

document.getElementById("search")?.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(value)
  );
  renderProducts(filtered);
});

function openProduct(id) {
  localStorage.setItem("selectedProduct", id);
  window.location.href = "product.html";
}

if (document.getElementById("productDetail")) {
  const id = localStorage.getItem("selectedProduct");
  const p = products.find(x => x.id == id);

  if (!p) {
    document.getElementById("productDetail").innerHTML = "<h2>Product not found</h2>";
  } else {
    document.getElementById("productDetail").innerHTML = `
      <div class="img-box">
        <img src="${p.image}" alt="${p.name}">
      </div>

      <div>
        <h2>${p.name}</h2>
        <p>${p.desc}</p>
        <h3>₹${p.price}</h3>

        <input type="number" id="qty" value="1" min="1">
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
  }
}

function quickAdd(id) {
  addToCart(id, 1);
}

function addToCart(id, qtyParam) {
  const product = products.find(p => p.id === id);

  const qty = qtyParam || parseInt(document.getElementById("qty")?.value || 1);

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let existing = cart.find(i => i.id === id);

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...product, quantity: qty });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to cart!");
}

if (document.getElementById("cartContainer")) {
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cartContainer");
  const totalEl = document.getElementById("cartTotal");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    container.innerHTML = "<h3>Your cart is empty 😢</h3>";
    totalEl.textContent = "";
    return;
  }

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    container.innerHTML += `
      <div class="cart-item">
        <div>${item.name}</div>

        <div>
          <button onclick="decrease(${index})">➖</button>
          ${item.quantity}
          <button onclick="increase(${index})">➕</button>
        </div>

        <div>₹${item.price * item.quantity}</div>

        <button onclick="removeItem(${index})" class="remove">Remove</button>
      </div>
    `;
  });

  totalEl.textContent = "Total: ₹" + total;
  updateCartCount();
}

function increase(i) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart[i].quantity++;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function decrease(i) {
  let cart = JSON.parse(localStorage.getItem("cart"));

  if (cart[i].quantity > 1) {
    cart[i].quantity--;
  } else {
    cart.splice(i, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(i) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}