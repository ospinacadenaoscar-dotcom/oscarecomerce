document.addEventListener("DOMContentLoaded", async () => {
    const sesionActiva = localStorage.getItem("sesionActiva");

    console.log("🔍 Verificando sesión:", sesionActiva);

    // Verificar sesión activa 
    if (!sesionActiva) {
        console.log("⚠️ No hay sesión activa, redirigiendo a login");
        window.location.href = "../pages/login.html";
        return;
    }

    // Traer los datos del localStorage
    const perfil = JSON.parse(localStorage.getItem("usuario"));
    console.log("👤 Perfil en localStorage:", perfil);
    
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

    // Insertar datos en el nombre y avatar
    const userNameElements = document.querySelectorAll("#user-name");
    const nombreCompleto = `${usuario.Nombre || ''} ${usuario.Apellido || ''}`.trim();
    
    userNameElements.forEach(el => {
        el.textContent = nombreCompleto || "Usuario";
    });

    const userEmailElement = document.getElementById("user-email");
    if (userEmailElement) {
        userEmailElement.textContent = usuario.Gmail || '';
    }

    const avatar = `${usuario.Nombre?.[0] || 'U'}${usuario.Apellido?.[0] || ''}`.toUpperCase();
    const userAvatarElement = document.getElementById("user-avatar");
    if (userAvatarElement) {
        userAvatarElement.textContent = avatar;
    }

    console.log("✅ Avatar creado:", avatar);

    // Llenar los campos del formulario (solo lectura en perfil.html)
    const inputs = document.querySelectorAll("form input");

    // Nombre
    if (inputs[0]) {
        inputs[0].value = usuario.Nombre || '';
        inputs[0].disabled = true;
    }

    // Apellido
    if (inputs[1]) {
        inputs[1].value = usuario.Apellido || '';
        inputs[1].disabled = true;
    }

    // Correo
    if (inputs[2]) {
        inputs[2].value = usuario.Gmail || '';
        inputs[2].disabled = true;
    }

    // Teléfono
    if (inputs[3]) {
        inputs[3].value = usuario.Telefono || '';
        inputs[3].disabled = true;
    }

    console.log("✅ Perfil cargado correctamente");
});