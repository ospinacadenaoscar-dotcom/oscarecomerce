// ⚠️ CORREGIDO: Había un espacio antes de http
const API_URL = 'https://techstoreapp.onrender.com/api/users/register';

console.log('✅ Script de registro cargado');

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    
    if (!form) {
        console.error('❌ Formulario no encontrado');
        return;
    }
    
    console.log('✅ Formulario encontrado:', form);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        console.log('🚀 Formulario enviado');
        
        // Obtener datos del formulario
        const datos = {
            Nombre: document.getElementById('nombre').value.trim(),
            Apellido: document.getElementById('apellido').value.trim(),
            Edad: document.getElementById('edad').value.trim(),
            Telefono: document.getElementById('telefono').value.trim(),
            Gmail: document.getElementById('correo').value.trim(),
            Paswords: document.getElementById('password').value
        };
        
        console.log('📤 Datos a enviar:', datos);
        
        // Validación de campos vacíos
        if (!datos.Nombre || !datos.Apellido || !datos.Telefono || !datos.Gmail || !datos.Paswords) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos',
                confirmButtonColor: '#9333ea'
            });
            return;
        }
        
        // Validación de contraseña
        if (datos.Paswords.length < 6) {
            Swal.fire({
                icon: 'warning',
                title: 'Contraseña muy corta',
                text: 'La contraseña debe tener al menos 6 caracteres',
                confirmButtonColor: '#9333ea'
            });
            return;
        }
        
        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datos.Gmail)) {
            Swal.fire({
                icon: 'warning',
                title: 'Email inválido',
                text: 'Por favor ingresa un correo electrónico válido',
                confirmButtonColor: '#9333ea'
            });
            return;
        }
        
        // Validación de teléfono
        if (datos.Telefono.length < 7) {
            Swal.fire({
                icon: 'warning',
                title: 'Teléfono inválido',
                text: 'El teléfono debe tener al menos 7 dígitos',
                confirmButtonColor: '#9333ea'
            });
            return;
        }
        
        // Mostrar loading
        Swal.fire({
            title: 'Creando cuenta...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        try {
            console.log('📡 Enviando petición a:', API_URL);
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            
            console.log('📊 Status de respuesta:', response.status);
            
            const data = await response.json();
            console.log('📥 Respuesta del servidor:', data);
            
            if (response.ok) {
                // ✅ Éxito
                Swal.fire({
                    icon: 'success',
                    title: '¡Cuenta creada!',
                    text: 'Redirigiendo al login...',
                    timer: 2000,
                    showConfirmButton: false,
                    confirmButtonColor: '#9333ea'
                });

                form.reset();

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            } else {
                // ❌ Error del servidor (correo duplicado, campos inválidos, etc)
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar',
                    text: data.message || 'Intenta nuevamente',
                    confirmButtonColor: '#9333ea'
                });
            }
            
        } catch (error) {
            console.error('❌ Error de conexión:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Verifica que esté corriendo en https://techstoreapp.onrender.com',
                confirmButtonColor: '#9333ea'
            });
        }
    });
});

// Validación en tiempo real del email
document.addEventListener('DOMContentLoaded', () => {
    const correoInput = document.getElementById('correo');
    if (correoInput) {
        correoInput.addEventListener('blur', function() {
            const email = this.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.classList.add('border-red-500');
                this.classList.remove('border-gray-300');
            } else {
                this.classList.remove('border-red-500');
                this.classList.add('border-gray-300');
            }
        });
    }
});