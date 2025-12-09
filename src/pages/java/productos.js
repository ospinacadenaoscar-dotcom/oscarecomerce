
// funcion de cargar productos
async function cargarProductos(){
    try{
        const response=await fetch('https://techstoreapp.onrender.com/api/productos');
        const productos=await response.json();

        // ⭐ GUARDAR PRODUCTOS GLOBALMENTE (NUEVA LÍNEA)
        window.todosLosProductos = productos;

        const grid= document.getElementById('productos-grid');
            grid.innerHTML=productos.map(producto=>`
                <div class="bg-white rounded-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 product-card"
                    data-category="laptops"
                    data-price="${producto.precio}"
                    data-product-Id="laptops"${producto.productId}">

                    <div class="=bg-linear-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center overflow-hidden">
                    <img src="${producto.imagen}" alt="${producto.Nombre}"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy">

                    <div class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    15%
                    </div>
                    </div>

                    <div class="p-6">
                    <h3 class="text-lg font-bold text-gray-800">
                    ${producto.Nombre}
                    </h3>
                    <p class="text-sm text-gray-800 mb-4">
                    ${producto.Descripcion}
                    </p>

                    <div class="flex items-center justify-between mb-4">
                    <div>
                    <span class="text-2xl font-bold text-blue-600">
                    ${(producto.Precio ||0).toLocaleString('es-CO')}
                    </span>
                    </div>

                    <div class="flex text-yellow-600">
                    ⭐⭐⭐⭐⭐
                    </div>
                    </div>
                    <div class="flex space-x-2">
                    <button class="ver-deatalles-btn bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex-1 text-sm">
                    Ver Detalles
                    </button>
                    <button onclick="agregarAlCarrito('${producto._id || producto.id}')" class="add-to-cart-btn bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex-1 text-sm">
                    Comprar
                    </button>
                    </div>
                    </div>
                </div>
                `).join('');
                console.log("productos cargados con exito");
                
                // ⭐ ACTUALIZAR CONTADOR (NUEVA LÍNEA)
                actualizarContador();
    }catch(error){
        console.error("error al cargar los productos",error);
    }
}

cargarProductos();

setInterval(() => {
    cargarProductos();
}, 5000); // 5000 ms = 5 segundos


// ========================================
// ⭐ CÓDIGO NUEVO - FUNCIONES DEL CARRITO
// ========================================

// Obtener carrito del localStorage
let carrito = JSON.parse(localStorage.getItem('cart')) || [];

// FUNCIÓN PRINCIPAL: Agregar al carrito
window.agregarAlCarrito = function(productoId) {
    console.log('🛒 Agregando producto:', productoId);
    
    // Buscar el producto
    const producto = window.todosLosProductos.find(p => (p._id || p.id) === productoId);
    
    if (!producto) {
        alert('Producto no encontrado');
        return;
    }
    
    // Verificar si ya está en el carrito
    const yaExiste = carrito.find(item => item.id === productoId);
    
    if (yaExiste) {
        mostrarNotificacion('Este producto ya está en tu carrito 🛒', 'info');
        return;
    }
    
    // Crear objeto para el carrito
    const itemCarrito = {
        id: producto._id || producto.id,
        name: producto.Nombre,
        price: producto.Precio || 0,
        image: producto.imagen,
        category: producto.categoria || 'General'
    };
    
    // Agregar al carrito
    carrito.push(itemCarrito);
    
    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(carrito));
    
    // Actualizar contador
    actualizarContador();
    
    // Mostrar notificación
    mostrarNotificacion(`✅ ${producto.Nombre} agregado al carrito`, 'success');
    
    // Animar ícono
    animarCarrito();
    
    console.log('✅ Carrito actualizado:', carrito);
};

// Actualizar contador del carrito
function actualizarContador() {
    const contador = document.getElementById('cart-counter');
    
    if (!contador) return;
    
    carrito = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (carrito.length > 0) {
        contador.textContent = carrito.length;
        contador.style.display = 'flex';
    } else {
        contador.style.display = 'none';
    }
}

// Animar ícono del carrito
function animarCarrito() {
    const icono = document.querySelector('.cart-icon');
    if (icono) {
        icono.classList.add('animate-bounce');
        setTimeout(() => {
            icono.classList.remove('animate-bounce');
        }, 500);
    }
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
    const colores = {
        success: 'bg-green-500',
        info: 'bg-blue-500',
        error: 'bg-red-500'
    };
    
    const notif = document.createElement('div');
    notif.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl ${colores[tipo]} text-white font-semibold transition-all duration-500`;
    notif.style.transform = 'translateX(400px)';
    notif.textContent = mensaje;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notif.style.transform = 'translateX(400px)';
        setTimeout(() => notif.remove(), 500);
    }, 3000);
}

// Actualizar contador al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarContador();
});

console.log('🛒 Sistema de carrito cargado');