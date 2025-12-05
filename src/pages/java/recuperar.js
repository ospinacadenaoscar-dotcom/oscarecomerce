// recuperar.js - Para la página que SOLICITA el código

async function enviarCodigo(event) {
    event.preventDefault();
    
    const emailInput = document.querySelector('input[type="email"]');
    const btnEnviar = document.querySelector('button[type="submit"]');
    const Gmail = emailInput.value.trim();

    // Validación
    if (!Gmail) {
        alert('⚠️ Por favor ingresa tu correo electrónico');
        return;
    }

    if (!Gmail.includes('@')) {
        alert('⚠️ Por favor ingresa un correo válido');
        return;
    }

    // Deshabilitar botón
    btnEnviar.textContent = 'Enviando...';
    btnEnviar.disabled = true;

    try {
        const res = await fetch('http://localhost:8081/api/recuperar/solicitar-codigo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Gmail: Gmail })
        });

        const data = await res.json();

        if (res.ok) {
            // Guardar email en sessionStorage para usarlo después
            sessionStorage.setItem('emailRecuperacion', Gmail); 
            
            alert('✅ Código enviado correctamente. Revisa tu correo.');
            
            // Redirigir a la página de restablecer
            window.location.href = './verificacion.html';
        } else {
            alert('❌ ' + data.message);
            btnEnviar.textContent = 'Enviar Código';
            btnEnviar.disabled = false;
        }

    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al enviar el código. Inténtalo de nuevo.');
        btnEnviar.textContent = 'Enviar Código';
        btnEnviar.disabled = false;
    }
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}

function inicializar() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', enviarCodigo);
    } else {
        console.error('❌ No se encontró el formulario en la página');
    }
}


// Agregar evento al formulario
document.querySelector('form').addEventListener('submit', enviarCodigo);