// ========================================
// 1. ESPERAR A QUE LA PÁGINA CARGUE COMPLETAMENTE
// ========================================
// DOMContentLoaded se dispara cuando el HTML está completamente cargado
// Esto evita errores al intentar acceder a elementos que aún no existen
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // 2. OBTENER ELEMENTOS DEL DOM
    // ========================================
    // getElementById busca un elemento HTML por su atributo "id"
    // Lo guardamos en variables para usarlo múltiples veces sin buscarlo de nuevo
    const cartCounter = document.getElementById('cart-counter'); // El número en el ícono del carrito
    const enviarButton = document.getElementById('enviar-code'); // Botón "Finalizar Compra"
    
    // querySelector busca el PRIMER elemento que coincida con un selector CSS
    // Aquí buscamos los elementos que mostrarán el subtotal y total
    const subtotalElement = document.querySelector('.flex.justify-between.text-gray-700.mb-2 span:last-child');
    const totalElement = document.querySelector('.text-lg.font-bold.bg-linear-to-r');
    
    // ========================================
    // 3. OBTENER EL CARRITO DEL ALMACENAMIENTO LOCAL
    // ========================================
    // localStorage es como una "memoria" del navegador que guarda información
    // incluso cuando cierras la página
    
    // localStorage.getItem('cart') busca si existe algo guardado con el nombre 'cart'
    // || [] significa: "si no existe nada, usa un array vacío []"
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // JSON.parse convierte texto en un objeto JavaScript que podemos usar
    
    // ========================================
    // 4. FUNCIÓN PARA CALCULAR EL TOTAL DEL CARRITO
    // ========================================
    // Una función es un bloque de código reutilizable
    function calculateTotal() {
        // reduce es un método que "reduce" un array a un solo valor
        // Recorre cada producto y suma los precios
        const total = cart.reduce((sum, product) => {
            // sum es el acumulador (empieza en 0)
            // product es cada producto del carrito
            // product.price es el precio del producto actual
            return sum + product.price; // Sumamos el precio al total
        }, 0); // El 0 es el valor inicial del acumulador
        
        return total; // Devolvemos el total calculado
    }
    
    // ========================================
    // 5. FUNCIÓN PARA FORMATEAR NÚMEROS COMO DINERO
    // ========================================
    // Convierte 1000 en "$1,000" para que se vea mejor
    function formatCurrency(amount) {
        // toLocaleString formatea números según el idioma/región
        return '$' + amount.toLocaleString('es-CO', {
            minimumFractionDigits: 0, // Sin decimales
            maximumFractionDigits: 0  // Sin decimales
        });
    }
    
    // ========================================
    // 6. FUNCIÓN PARA ACTUALIZAR LA INTERFAZ
    // ========================================
    // Esta función actualiza lo que el usuario ve en pantalla
    function updateCartDisplay() {
        // Calculamos el total del carrito
        const total = calculateTotal();
        
        // ========================================
        // 6.1 Actualizar contador del ícono del carrito
        // ========================================
        if (cart.length > 0) {
            // Si hay productos en el carrito
            cartCounter.textContent = cart.length; // Mostramos cuántos hay
            cartCounter.style.display = 'flex'; // Hacemos visible el contador
        } else {
            // Si el carrito está vacío
            cartCounter.style.display = 'none'; // Ocultamos el contador
        }
        
        // ========================================
        // 6.2 Actualizar subtotal y total
        // ========================================
        // textContent cambia el texto dentro de un elemento HTML
        subtotalElement.textContent = formatCurrency(total);
        totalElement.textContent = formatCurrency(total);
        
        // ========================================
        // 6.3 Crear la lista visual de productos
        // ========================================
        displayCartItems();
    }
    
    // ========================================
    // 7. FUNCIÓN PARA MOSTRAR LOS PRODUCTOS EN LA PÁGINA
    // ========================================
    function displayCartItems() {
        // Buscamos el contenedor donde pondremos los productos
        // Este div debe estar después del header en tu HTML
        let cartContainer = document.getElementById('cart-items-container');
        
        // Si no existe el contenedor, lo creamos
        if (!cartContainer) {
            // createElement crea un nuevo elemento HTML
            cartContainer = document.createElement('div');
            cartContainer.id = 'cart-items-container'; // Le damos un id
            cartContainer.className = 'max-w-4xl mx-auto px-4 mb-8'; // Clases de Tailwind
            
            // Buscamos el elemento después del cual insertaremos el contenedor
            const header = document.querySelector('header');
            // insertAdjacentElement inserta un elemento en una posición específica
            // 'afterend' significa "justo después del elemento"
            header.insertAdjacentElement('afterend', cartContainer);
        }
        
        // ========================================
        // 7.1 Limpiar el contenedor antes de llenarlo
        // ========================================
        cartContainer.innerHTML = ''; // Borramos todo lo que había antes
        
        // ========================================
        // 7.2 Verificar si el carrito está vacío
        // ========================================
        if (cart.length === 0) {
            // Si no hay productos, mostramos un mensaje
            cartContainer.innerHTML = `
                <div class="text-center py-16">
                    <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    <h2 class="text-2xl font-bold text-gray-700 mb-2">Tu carrito está vacío</h2>
                    <p class="text-gray-500 mb-6">Agrega productos desde nuestra tienda</p>
                    <a href="./productos.html" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        Ir a Productos
                    </a>
                </div>
            `;
            return; // Salimos de la función
        }
        
        // ========================================
        // 7.3 Crear el HTML para cada producto
        // ========================================
        // map recorre cada elemento del array y crea un nuevo array con los resultados
        const cartItemsHTML = cart.map((product, index) => {
            // index es la posición del producto en el array (0, 1, 2, etc.)
            // Template literals (```) permiten crear strings con múltiples líneas
            return `
                <div class="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 mb-4 hover:shadow-lg transition-shadow">
                    <img src="${product.image}" alt="${product.name}" class="w-24 h-24 object-cover rounded-lg">
                    <div class="flex-1">
                        <h3 class="font-semibold text-lg text-gray-800">${product.name}</h3>
                        <p class="text-gray-600">${product.category}</p>
                        <p class="text-blue-600 font-bold text-lg mt-1">${formatCurrency(product.price)}</p>
                    </div>
                    <button onclick="removeFromCart(${index})" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Eliminar
                    </button>
                </div>
            `;
        }).join(''); // join('') une todos los elementos del array en un solo string
        
        // Insertamos el HTML generado en el contenedor
        cartContainer.innerHTML = cartItemsHTML;
    }
    
    // ========================================
    // 8. FUNCIÓN PARA ELIMINAR PRODUCTOS DEL CARRITO
    // ========================================
    // Esta función debe ser global (accesible desde cualquier parte)
    // por eso usamos window
    window.removeFromCart = function(index) {
        // splice elimina elementos de un array
        // (índice, cantidad a eliminar)
        cart.splice(index, 1); // Elimina 1 elemento en la posición 'index'
        
        // Guardamos el carrito actualizado en localStorage
        // JSON.stringify convierte un objeto JavaScript en texto
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Actualizamos la pantalla
        updateCartDisplay();
    };
    
    // ========================================
    // 9. VALIDAR Y FINALIZAR LA COMPRA
    // ========================================
    // addEventListener añade un "escuchador" de eventos
    // 'click' significa que ejecutará la función cuando se haga clic
    enviarButton.addEventListener('click', function() {
        // Verificar si el carrito está vacío
        if (cart.length === 0) {
            // alert muestra una ventana emergente
            alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
            return; // Salimos de la función
        }
        
        // ========================================
        // 9.1 Obtener los valores de los inputs
        // ========================================
        // querySelector busca elementos usando selectores CSS
        const direccion = document.querySelector('input[placeholder*="Calle"]').value.trim();
        const ciudad = document.getElementById('ciudad').value.trim();
        const codigo = document.getElementById('codigo').value.trim();
        const metodoPago = document.querySelector('select').value;
        
        // trim() elimina espacios en blanco al inicio y final
        // value obtiene el valor que el usuario escribió
        
        // ========================================
        // 9.2 Validar que todos los campos estén llenos
        // ========================================
        // ! significa "no" o "negación"
        if (!direccion || !ciudad || !codigo) {
            alert('Por favor completa todos los campos de envío.');
            return;
        }
        
        // ========================================
        // 9.3 Crear el objeto del pedido
        // ========================================
        const pedido = {
            productos: cart, // Los productos del carrito
            direccion: direccion,
            ciudad: ciudad,
            codigoPostal: codigo,
            metodoPago: metodoPago,
            total: calculateTotal(),
            fecha: new Date().toLocaleString('es-CO') // Fecha y hora actual
        };
        
        // ========================================
        // 9.4 Mostrar confirmación
        // ========================================
        console.log('Pedido realizado:', pedido);
        // console.log muestra información en la consola del navegador (F12)
        
        alert(`¡Pedido realizado con éxito! 🎉\n\nTotal: ${formatCurrency(pedido.total)}\nDirección: ${direccion}\nCiudad: ${ciudad}\nMétodo de pago: ${metodoPago}`);
        
        // ========================================
        // 9.5 Limpiar el carrito
        // ========================================
        cart = []; // Vaciamos el array
        localStorage.setItem('cart', JSON.stringify(cart)); // Guardamos el carrito vacío
        
        // Limpiar los campos del formulario
        document.querySelector('input[placeholder*="Calle"]').value = '';
        document.getElementById('ciudad').value = '';
        document.getElementById('codigo').value = '';
        
        // Actualizar la pantalla
        updateCartDisplay();
        
        // Opcional: Redirigir a otra página
        // setTimeout espera un tiempo antes de ejecutar algo
        setTimeout(() => {
            // window.location.href cambia la página actual
            window.location.href = './index.html';
        }, 2000); // 2000 milisegundos = 2 segundos
    });
    
    // ========================================
    // 10. INICIALIZAR LA PÁGINA
    // ========================================
    // Llamamos a la función para mostrar el carrito cuando carga la página
    updateCartDisplay();
});

// ========================================
// RESUMEN DE CONCEPTOS IMPORTANTES
// ========================================
/*
1. localStorage: Almacenamiento local del navegador que persiste datos
2. JSON.parse(): Convierte texto a objeto JavaScript
3. JSON.stringify(): Convierte objeto JavaScript a texto
4. querySelector/getElementById: Buscan elementos HTML
5. addEventListener: Escucha eventos (clicks, cambios, etc.)
6. map(): Transforma cada elemento de un array
7. reduce(): Reduce un array a un solo valor
8. Template literals (``): Strings de múltiples líneas con variables
9. Arrow functions (=>): Funciones cortas y modernas
10. DOM: Document Object Model - la estructura HTML como objetos JavaScript
*/