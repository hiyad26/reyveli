/* =========================
   REYVELI — APP.JS
   ========================= */

const menuItems = [
  {
    id: 1,
    name: "Classic Beef Burger",
    category: "burgers",
    price: 85,
    description: "Juicy beef patty, fresh vegetables and special sauce.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Crispy Chicken",
    category: "meals",
    price: 75,
    description: "Crispy chicken with a delicious golden coating.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Loaded Fries",
    category: "snacks",
    price: 55,
    description: "Crispy fries loaded with cheese and tasty toppings.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Iced Coffee",
    category: "drinks",
    price: 45,
    description: "Cold, creamy and refreshing iced coffee.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Chicken Wrap",
    category: "meals",
    price: 70,
    description: "Tender chicken, fresh vegetables and creamy sauce.",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Chocolate Cake",
    category: "desserts",
    price: 60,
    description: "Rich and soft chocolate cake for something sweet.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80"
  }
];


/* =========================
   CART
   ========================= */

let cart = JSON.parse(localStorage.getItem("reyveliCart")) || [];


/* =========================
   START APP
   ========================= */

document.addEventListener("DOMContentLoaded", function () {
  renderMenu();
  renderCart();
});


/* =========================
   RENDER MENU
   ========================= */

function renderMenu(category = "all") {

  const grid = document.getElementById("menuGrid");

  if (!grid) return;

  const items =
    category === "all"
      ? menuItems
      : menuItems.filter(item => item.category === category);

  grid.innerHTML = items.map(item => {

    return `
      <article class="food-card">

        <img
          class="food-image"
          src="${item.image}"
          alt="${item.name}"
          loading="lazy"
        >

        <div class="food-info">

          <div class="food-category">
            ${item.category}
          </div>

          <h3 class="food-name">
            ${item.name}
          </h3>

          <p class="food-description">
            ${item.description}
          </p>

          <div class="food-bottom">

            <div class="food-price">
              MVR ${item.price}
            </div>

            <button
              class="add-button"
              onclick="addToCart(${item.id})"
              aria-label="Add ${item.name} to cart"
            >
              +
            </button>

          </div>

        </div>

      </article>
    `;

  }).join("");
}


/* =========================
   CATEGORY FILTER
   ========================= */

function filterMenu(category, button) {

  document.querySelectorAll(".category").forEach(btn => {
    btn.classList.remove("active");
  });

  if (button) {
    button.classList.add("active");
  }

  renderMenu(category);
}


/* =========================
   ADD TO CART
   ========================= */

function addToCart(id) {

  const item = menuItems.find(product => product.id === id);

  if (!item) return;

  const existing = cart.find(product => product.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      ...item,
      quantity: 1
    });
  }

  saveCart();
  renderCart();

  const cartButton = document.querySelector(".cart-button");

  if (cartButton) {

    cartButton.style.transform = "scale(1.12)";

    setTimeout(() => {
      cartButton.style.transform = "scale(1)";
    }, 150);

  }
}


/* =========================
   CHANGE QUANTITY
   ========================= */

function changeQuantity(id, amount) {

  const item = cart.find(product => product.id === id);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  saveCart();
  renderCart();
}


/* =========================
   SAVE CART
   ========================= */

function saveCart() {

  localStorage.setItem(
    "reyveliCart",
    JSON.stringify(cart)
  );

}


/* =========================
   RENDER CART
   ========================= */

function renderCart() {

  const container =
    document.getElementById("cartItems");

  const count =
    document.getElementById("cartCount");

  const totalElement =
    document.getElementById("cartTotal");


  if (!container) return;


  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );


  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


  if (count) {
    count.textContent = totalItems;
  }


  if (totalElement) {
    totalElement.textContent = totalPrice;
  }


  if (cart.length === 0) {

    container.innerHTML = `
      <div class="empty-cart">

        <div class="empty-icon">
          🛒
        </div>

        <h3>Your cart is empty</h3>

        <p>
          Add something delicious from the menu.
        </p>

      </div>
    `;

    return;
  }


  container.innerHTML = cart.map(item => {

    const itemTotal =
      item.price * item.quantity;


    return `
      <div class="cart-item">

        <div class="cart-item-info">

          <h4>
            ${item.name}
          </h4>

          <p>
            MVR ${itemTotal}
          </p>

        </div>


        <div class="quantity-controls">

          <button
            onclick="changeQuantity(${item.id}, -1)"
          >
            −
          </button>


          <strong>
            ${item.quantity}
          </strong>


          <button
            onclick="changeQuantity(${item.id}, 1)"
          >
            +
          </button>

        </div>

      </div>
    `;

  }).join("");
}


/* =========================
   OPEN CART
   ========================= */

function openCart() {

  document
    .getElementById("cartDrawer")
    .classList.add("show");


  document
    .getElementById("cartOverlay")
    .classList.add("show");


  document.body.style.overflow = "hidden";

}


/* =========================
   CLOSE CART
   ========================= */

function closeCart() {

  document
    .getElementById("cartDrawer")
    .classList.remove("show");


  document
    .getElementById("cartOverlay")
    .classList.remove("show");


  document.body.style.overflow = "";

}


/* =========================
   SCROLL TO MENU
   ========================= */

function scrollToMenu() {

  const menu =
    document.getElementById("menu");


  if (menu) {

    menu.scrollIntoView({
      behavior: "smooth"
    });

  }

}


/* =========================
   HOME
   ========================= */

function goHome() {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================
   ORDERS
   ========================= */

function showOrders() {

  alert(
    "Your orders section will be connected to the REYVELI ordering system next."
  );

}


/* =========================
   CHECKOUT
   ========================= */

function checkout() {

  if (cart.length === 0) {

    alert("Your cart is empty.");

    return;
  }


  /* Open the real checkout page */

  window.location.href = "checkout.html";

}
