// Script de login - Techstore Pro

// Verificar que toda la pagina este cargada con los elementos HTML
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Página cargada correctamente - sistema listo');

    // Creamos la constante de la API
    const API_URL = "https://techstoreapp.onrender.com/api/login";

    // Enviar los datos del formulario 
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        // Preparamos los elementos de la pagina 
        const btn = document.getElementById('login-btn');
        const errorDiv = document.getElementById('login-error');
        const errorMsg = document.getElementById('login-error-message');

        errorDiv.classList.add('hidden');

        // Recoger los campos del formulario (ID CORREGIDO: 'email' en minúscula)
        const datos = {
            Gmail: document.getElementById('email').value.trim(), 
            Paswords: document.getElementById('password').value   
        };

        // Validamos que los campos no esten vacios 
        if (!datos.Gmail || !datos.Paswords) {
            errorMsg.textContent = "Por favor complete los datos requeridos";
            errorDiv.classList.remove('hidden');
            return;
        }

        // Cambia el boton mientras procesa
        btn.disabled = true; 
        btn.textContent = "Iniciando sesión...";

        // Enviamos los datos al servidor
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            // Recibir respuesta del servidor 
            const rawText = await response.text();
            let resultado

            try {
                resultado = JSON.parse(rawText)
            } catch(e){
                console.error("❌ el servidor no devolvio json valido ", rawText)
                throw new Error (" respuesta invalida del servidor ")
            }

            if (response.ok) {
                console.log('✅ 201 - Inicio de sesión exitoso');

                // Guardar informacion 
                localStorage.setItem("sesionActiva", "true");
                localStorage.setItem("usuario", JSON.stringify({
                    id: resultado.usuario._id,
                    Nombre: resultado.usuario.Nombre,
                    Apellido: resultado.usuario.Apellido,
                    Gmail: resultado.usuario.Gmail,
                    Telefono: resultado.usuario.Telefono
                }));

                // Mensaje de exito
                errorDiv.className = 'bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg';
                errorMsg.textContent = "¡Inicio de sesión exitoso! Redireccionando...";
                errorDiv.classList.remove('hidden');

                // Redirigir a productos (2 segundos en lugar de 8)
                setTimeout(() => window.location.href = 'productos.html', 700); // ⚠️ CORREGIDO: era 8000

            } else {
                // Credenciales incorrectas
                errorMsg.textContent = resultado.message || 'Credenciales incorrectas';
                errorDiv.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'iniciar sesion'
            }

        } catch (error) {
            // Si no hay conexion al servidor
            console.error('❌ Error 500 - Error de conexión con el servidor:', error);
            errorMsg.textContent = 'Error de conexión con el servidor. Verifica que el servidor esté corriendo.';
            errorDiv.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = 'iniciar sesion'
            btn.innerHTML = `
                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
                Iniciar Sesión
            `;
        }
    });
});