document.addEventListener("DOMContentLoaded", async () => {
    const sesionActiva = localStorage.getItem("sesionActiva");
    const icono = document.getElementById("icono-inicio");

    if (sesionActiva && icono) {
        icono.classList.add("hidden");
    }

    // Verificar sesión activa 
    if (!sesionActiva) {
        window.location.href = "../pages/login.html";
        return;
    }

    // Traer los datos del localStorage
    const perfil = JSON.parse(localStorage.getItem("usuario"));
    console.log("📧 Email del usuario:", perfil);
    
    if (!perfil || !perfil.Gmail) {
        console.error("❌ No hay perfil o Gmail en localStorage");
        window.location.href = "../pages/login.html";
        return;
    }

    let usuario = null;

    try {
        console.log("📤 Enviando email:", perfil.Gmail);
        
        const res = await fetch("http://localhost:8081/api/perfil/obterPerfil", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: perfil.Gmail })
        });

        console.log("📊 Status de respuesta:", res.status);
        const data = await res.json();
        console.log("📦 Datos recibidos:", data);
        
        if (!res.ok) {
            throw new Error(data.message || "No se pudo obtener perfil");
        }
        
        usuario = data.user;
        console.log("✅ Usuario obtenido del servidor:", usuario);
        
    } catch (err) {
        console.error("❌ Error al obtener el perfil:", err);
        
        // Usar datos del localStorage como respaldo
        console.log("ℹ️ Usando datos del localStorage como respaldo");
        usuario = perfil;
        
        // No redirigir al login si tenemos datos en localStorage
        if (!usuario) {
            alert("❌ No se pudo cargar el perfil");
            localStorage.clear();
            window.location.href = "../pages/login.html";
            return;
        }
    }

    // Insertar datos en el menú y avatar
    const userNameElements = document.querySelectorAll("#user-name");
    userNameElements.forEach(el => {
        el.textContent = `${usuario.Nombre} ${usuario.Apellido}`;
    });

    const userEmailElement = document.getElementById("user-email");
    if (userEmailElement) {
        userEmailElement.textContent = usuario.Gmail;
    }

    const avatar = `${usuario.Nombre[0]}${usuario.Apellido[0]}`.toUpperCase();
    const userAvatarElement = document.getElementById("user-avatar");
    if (userAvatarElement) {
        userAvatarElement.textContent = avatar;
    }

    // Llenar los campos del formulario
    const inputs = document.querySelectorAll("form input");

    // Nombre
    if (inputs[0]) inputs[0].value = usuario.Nombre || '';

    // Apellido
    if (inputs[1]) inputs[1].value = usuario.Apellido || '';

    // Correo (deshabilitar)
    if (inputs[2]) {
        inputs[2].value = usuario.Gmail || '';
        inputs[2].disabled = true;
        inputs[2].classList.add('cursor-not-allowed', 'bg-gray-200');
    }

    // Teléfono
    if (inputs[3]) inputs[3].value = usuario.Telefono || '';

    // Manejar el envío del formulario
    const formulario = document.querySelector("form");
    
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const Nombre = inputs[0].value.trim();
        const Apellido = inputs[1].value.trim();
        const Telefono = inputs[3].value.trim();

        // Validar campos
        if (!Nombre || !Apellido || !Telefono) {
            alert("⚠️ Por favor, completa todos los campos obligatorios");
            return;
        }

        try {
            const res = await fetch("http://localhost:8081/api/perfil/actualizar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Gmail: usuario.Gmail,
                    Nombre: Nombre,
                    Apellido: Apellido,
                    Telefono: Telefono
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error al actualizar perfil");
            }

            // Actualizar localStorage
            const usuarioActualizado = {
                Gmail: usuario.Gmail,
                Nombre: data.usuario.Nombre,
                Apellido: data.usuario.Apellido,
                Telefono: data.usuario.Telefono
            };
            localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

            // Mostrar mensaje de éxito
            alert("✅ Perfil actualizado exitosamente");

            // Redirigir a la página de perfil
            window.location.href = "./perfil.html";

        } catch (err) {
            console.error("Error al actualizar perfil:", err);
            alert("❌ " + err.message);
        }
    });
});