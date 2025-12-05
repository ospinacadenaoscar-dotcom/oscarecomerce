document.addEventListener('DOMContentLoaded', async () => {
    const sesionActiva = localStorage.getItem("sesionActiva");
    const contenedor = document.getElementById("user-menu-container");

    console.log("🔍 Verificando sesión:", sesionActiva);

    if (!contenedor) {
        console.error("❌ No se encontró el contenedor user-menu-container");
        return;
    }
    
    if (!sesionActiva) {
        console.log("⚠️ No hay sesión activa");
        return;
    }

    // Obtener perfil del localStorage
    const perfil = JSON.parse(localStorage.getItem("usuario"));
    console.log("👤 Perfil en localStorage:", perfil);
    
    if (!perfil || !perfil.Gmail) {
        console.error("❌ No hay perfil o Gmail en localStorage");
        return;
    }

    let usuario = null;

    try {
        console.log("📡 Consultando perfil al servidor...");
        console.log("📧 Email a enviar:", perfil.Gmail);
        
        const res = await fetch("http://localhost:8081/api/perfil/obterPerfil", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: perfil.Gmail }) // ← CAMBIO: Gmail → email
        });

        const data = await res.json();
        console.log("📥 Respuesta del servidor:", data);
        
        if (!res.ok) throw new Error(data.message || "No se pudo obtener perfil");
        usuario = data.user; // ← CAMBIO: usuario → user

    } catch (error) {
        console.error("❌ Error al obtener perfil:", error);
        // Usar datos del localStorage como fallback
        usuario = perfil;
        console.log("ℹ️ Usando datos del localStorage como respaldo");
    }

    // Crear menú
    contenedor.innerHTML = `
        <div class="relative">
            <button id="user-menu-btn"
                class="w-14 h-14 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md hover:scale-105 transition-transform">
                <span id="user-avatar"></span>
            </button>

            <div id="user-dropdown"
                class="hidden absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 
                       transition-all duration-200 ease-out overflow-hidden transform origin-top scale-95 opacity-0">

                <div class="px-4 py-3 border-b border-gray-200">
                    <p class="text-sm font-semibold text-gray-900" id="user-name"></p>
                    <p class="text-xs text-gray-500" id="user-email"></p>
                </div>

                <a href="../pages/perfil.html"
                    class="flex items-center px-4 py-3 text-sm text-gray-700 
                           hover:bg-blue-100 hover:text-blue-800 
                           active:bg-blue-200 transition-all duration-150 rounded-md cursor-pointer">
                    Mi Perfil
                </a>

                <button id="logout-btn"
                    class="flex items-center w-full px-4 py-3 text-sm text-red-600
                           hover:bg-red-100 hover:text-red-800 
                           active:bg-red-200 transition-all duration-150 rounded-md cursor-pointer">
                    Cerrar sesión
                </button>
            </div>
        </div>
    `;

    // Insertar datos
    const nombreCompleto = `${usuario.Nombre || ''} ${usuario.Apellido || ''}`.trim();
    document.getElementById("user-name").textContent = nombreCompleto || "Usuario";
    document.getElementById("user-email").textContent = usuario.Gmail || '';

    // Crear avatar con iniciales
    let avatar = "U"; // Default
    if (usuario.Nombre && usuario.Apellido) {
        avatar = `${usuario.Nombre[0]}${usuario.Apellido[0]}`.toUpperCase();
    } else if (usuario.Nombre) {
        avatar = usuario.Nombre[0].toUpperCase();
    }
    
    document.getElementById("user-avatar").textContent = avatar;
    console.log("✅ Avatar creado:", avatar);

    // ⭐ Menú toggle
    document.getElementById("user-menu-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        const drop = document.getElementById("user-dropdown");

        if (drop.classList.contains("hidden")) {
            drop.classList.remove("hidden");

            setTimeout(() => {
                drop.classList.remove("opacity-0", "scale-95");
                drop.classList.add("opacity-100", "scale-100");
            }, 20);

        } else {
            drop.classList.remove("opacity-100", "scale-100");
            drop.classList.add("opacity-0", "scale-95");

            setTimeout(() => {
                drop.classList.add("hidden");
            }, 150);
        }
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener("click", (e) => {
        const drop = document.getElementById("user-dropdown");
        const btn = document.getElementById("user-menu-btn");
        
        if (drop && !drop.classList.contains("hidden") && 
            !drop.contains(e.target) && !btn.contains(e.target)) {
            drop.classList.remove("opacity-100", "scale-100");
            drop.classList.add("opacity-0", "scale-95");
            setTimeout(() => drop.classList.add("hidden"), 150);
        }
    });

    // ⭐ Logout
    document.addEventListener("click", (e) => {
        if (e.target.id === "logout-btn" || e.target.closest("#logout-btn")) {
            console.log("🚪 Cerrando sesión...");
            
            localStorage.clear();

            const toast = document.getElementById("logout-toast");
            if (toast) {
                toast.classList.remove("hidden");
                setTimeout(() => toast.classList.add("opacity-100"), 20);

                setTimeout(() => {
                    toast.classList.remove("opacity-100");
                    setTimeout(() => {
                        window.location.href = "../pages/login.html";
                    }, 500);
                }, 1800);
            } else {
                // Si no hay toast, redirigir directamente
                window.location.href = "../pages/login.html";
            }
        }
    });

    console.log("✅ Menú de usuario cargado exitosamente");
});