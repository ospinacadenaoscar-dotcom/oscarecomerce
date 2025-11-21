// ======= Carrito Global =======
let cart = []; // { id, name, price, quantity }

// ======= Helpers =======
function formatMoney(n) {
  return new Intl.NumberFormat('es-CO').format(n);
}

// ======= Cargar desde LocalStorage =======
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem('myCart');
    cart = raw ? JSON.parse(raw) : [];
  } catch {
    cart = [];
  }
}

// ======= Guardar en LocalStorage =======
function saveCartToStorage() {
  localStorage.setItem('myCart', JSON.stringify(cart));
}

// ======= Añadir al carrito =======
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(product);
  }

  saveCartToStorage();
  updateCartCounter();
}

// ======= Actualizar contador (Productos Únicos) =======
function updateCartCounter() {
  const counterEl = document.getElementById('cart-counter');
  if (!counterEl) return;

  const count = cart.length; // SOLO productos distintos

  if (count > 0) {
    counterEl.style.display = "flex";
    counterEl.textContent = count;
  } else {
    counterEl.style.display = "none";
  }
}

// ======= Configurar botones "Agregar al carrito" =======
function setupAddButtons() {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = {
        id: btn.dataset.id,
        name: btn.dataset.product,
        price: Number(btn.dataset.price),
        quantity: 1
      };
      addToCart(product);
    });
  });
}

// ======= Inicializar =======
window.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  setupAddButtons();
  updateCartCounter();
});
