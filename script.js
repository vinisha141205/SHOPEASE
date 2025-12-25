
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const filterBtns = document.querySelectorAll(".filter-btn");
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");
const backToTop = document.getElementById("backToTop");
const contactModal = document.getElementById("contactModal");
const contactModalClose = document.getElementById("contactModalClose");
const productContactForm = document.getElementById("productContactForm");
const contactProduct = document.getElementById("contactProduct");
const wishlistToggle = document.getElementById("wishlistToggle");
const wishlistModal = document.getElementById("wishlistModal");
const wishlistModalClose = document.getElementById("wishlistModalClose");
const wishlistItems = document.getElementById("wishlistItems");
const pagination = document.getElementById("pagination");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

cartCount.textContent = cart.length;
updateWishlistBadge();

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filterProducts();
  });
});

sortSelect.addEventListener("change", filterProducts);
searchInput.addEventListener("input", filterProducts);

function filterProducts() {
  const category = document.querySelector(".filter-btn.active").dataset.filter;
  const searchTerm = searchInput.value.toLowerCase();
  const sortValue = sortSelect.value;

  let filtered = Array.from(document.querySelectorAll(".product"));

  if (category !== "all") {
    filtered = filtered.filter(p => p.dataset.category === category);
  }

  filtered = filtered.filter(p => {
    const name = p.querySelector("h3").textContent.toLowerCase();
    return name.includes(searchTerm);
  });

  filtered.sort((a, b) => {
    const nameA = a.querySelector("h3").textContent;
    const nameB = b.querySelector("h3").textContent;
    const priceA = parseInt(a.querySelector(".price").textContent.replace(/[^0-9]/g, ""));
    const priceB = parseInt(b.querySelector(".price").textContent.replace(/[^0-9]/g, ""));

    if (sortValue === "name-asc") return nameA.localeCompare(nameB);
    if (sortValue === "name-desc") return nameB.localeCompare(nameA);
    if (sortValue === "price-asc") return priceA - priceB;
    if (sortValue === "price-desc") return priceB - priceA;
  });

  document.querySelectorAll(".product").forEach(p => {
    p.style.display = "none";
    p.classList.remove("visible");
  });

   filtered.forEach((product, index) => {
    product.style.display = "block";
    setTimeout(() => {
      product.classList.add("visible");
    }, index * 50);
  });
 pagination.innerHTML = "";
}

document.querySelectorAll(".btn-buy").forEach(btn => {
  btn.addEventListener("click", () => {
    const productName = btn.closest(".product").querySelector("h3").textContent;
    cart.push(productName);
    localStorage.setItem("cart", JSON.stringify(cart));
    cartCount.textContent = cart.length;
    alert("Added to cart!");
  });
});

function updateWishlistBadge() {
  wishlistToggle.innerHTML = `❤️ ${wishlist.length}`;
}

document.querySelectorAll(".btn-wishlist").forEach(btn => {
  const id = btn.dataset.productId;
  if (wishlist.includes(id)) btn.classList.add("active");

  btn.addEventListener("click", () => {
    if (wishlist.includes(id)) {
      wishlist = wishlist.filter(w => w !== id);
      btn.classList.remove("active");
    } else {
      wishlist.push(id);
      btn.classList.add("active");
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistBadge();
    renderWishlist();
  });
});

wishlistToggle.addEventListener("click", () => {
  wishlistModal.classList.add("active");
  renderWishlist();
});

function renderWishlist() {
  wishlistItems.innerHTML = "";
  if (wishlist.length === 0) {
    wishlistItems.innerHTML = "<p>Your wishlist is empty</p>";
    return;
  }
  wishlist.forEach(id => {
    const originalProduct = document.querySelector(`.btn-wishlist[data-product-id="${id}"]`);
    if (originalProduct) {
      const product = originalProduct.closest(".product").cloneNode(true);
      product.querySelector(".product-actions").remove();
      wishlistItems.appendChild(product);
    }
  });
}

document.querySelectorAll(".btn-contact").forEach(btn => {
  btn.addEventListener("click", () => {
    contactProduct.value = btn.dataset.product;
    contactModal.classList.add("active");
  });
});

productContactForm.addEventListener("submit", e => {
  e.preventDefault();
  document.getElementById("productContactMessage").textContent = "Message sent successfully!";
  setTimeout(() => {
    contactModal.classList.remove("active");
    document.getElementById("productContactMessage").textContent = "";
  }, 2000);
  productContactForm.reset();
});

[wishlistModalClose, contactModalClose].forEach(close => {
  close.addEventListener("click", () => {
    close.closest(".modal").classList.remove("active");
  });
});

document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
});

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 500);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

filterProducts();