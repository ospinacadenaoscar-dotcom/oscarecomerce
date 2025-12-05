// ============================================
// VERIFICAR CÓDIGO Y CAMBIAR CONTRASEÑA
// ============================================

console.log('✅ verificar.js cargado correctamente');

// Cargar el email guardado cuando la página cargue
window.addEventListener('DOMContentLoaded', () => {
    const emailGuardado = sessionStorage.getItem('emailRecuperacion');
    const emailDisplay = document.getElementById('emailDisplay');
    
    console.log('📧 Email recuperado:', emailGuardado);
    
    if (emailGuardado && emailDisplay) {
        emailDisplay.textContent = emailGuardado;
    } else if (!emailGuardado) {
        alert('⚠️ No se encontró información de recuperación. Por favor solicita un nuevo código.');
        window.location.href = './recuperar.html';
    }
});

// Manejar el envío del formulario
document.getElementById('formVerificar')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log('🚀 Formulario enviado');

    const codigo = document.getElementById('codigoInput').value.trim();
    const nuevaPassword = document.getElementById('nuevaPassword').value;
    const confirmarPassword = document.getElementById('confirmarPassword').value;
    const Gmail = sessionStorage.getItem('emailRecuperacion');
    const btnCambiar = document.getElementById('btnCambiar');

    console.log('📝 Datos capturados:', { codigo, Gmail, passwordLength: nuevaPassword.length });

    // Validaciones
    if (!codigo) {
        alert('⚠️ Por favor ingresa el código de verificación');
        return;
    }

    if (codigo.length !== 6) {
        alert('⚠️ El código debe tener 6 dígitos');
        return;
    }

    if (!nuevaPassword) {
        alert('⚠️ Por favor ingresa la nueva contraseña');
        return;
    }

    if (nuevaPassword.length < 6) {
        alert('⚠️ La contraseña debe tener al menos 6 caracteres');
        return;
    }

    if (!confirmarPassword) {
        alert('⚠️ Por favor confirma la contraseña');
        return;
    }

    if (nuevaPassword !== confirmarPassword) {
        alert('⚠️ Las contraseñas no coinciden');
        return;
    }

    if (!Gmail) {
        alert('⚠️ No se encontró el correo electrónico');
        window.location.href = './recuperar.html';
        return;
    }

    // Deshabilitar botón
    btnCambiar.textContent = 'Verificando...';
    btnCambiar.disabled = true;

    console.log('📡 Enviando petición al servidor...');

    try {
        const res = await fetch('http://localhost:8081/api/recuperar/solicitar-codigo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                Gmail: Gmail,
                codigo: codigo,
                nuevaPassword: nuevaPassword 
            })
        });

        const data = await res.json();
        
        console.log('📨 Respuesta del servidor:', data);

        if (res.ok) {
            alert('✅ Contraseña cambiada exitosamente');
            sessionStorage.removeItem('emailRecuperacion');
            window.location.href = './login.html';
        } else {
            alert('❌ ' + data.message);
            btnCambiar.textContent = 'Cambiar Contraseña';
            btnCambiar.disabled = false;
        }

    } catch (error) {
        console.error('❌ Error:', error);
        alert('❌ Error al cambiar la contraseña. Inténtalo de nuevo.');
        btnCambiar.textContent = 'Cambiar Contraseña';
        btnCambiar.disabled = false;
    }
});

// Permitir solo números en el código
document.getElementById('codigoInput')?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
});