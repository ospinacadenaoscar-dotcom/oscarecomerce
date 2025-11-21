// scrip le login - Techstore Pro


// verificar que toda la pagina este cargada con los elementos 
// html

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ pagina cargada correctamente - sistema listo');

    // creamos la constante de la API
    const API_URL = "http://localhost:8081/api/login";

    // enviar los datos del formulario 
    document.getElementById('login-form').addEventListener('submit',async function (e){
        e.preventDefault();

        // preparamos los elementos de la pagina 
        const btn = document.getElementById('login-btn');
        const errorDiv = document.getElementById('login-error');
        const errorMsg = document.getElementById('login-error-message');

        errorDiv.classList.add('hidden');

        // recoger los campos del formulario 
        const datos={
            Gmail: document.getElementById('Email').value.trim(),
            password: document.getElementById('password').value
        };

        // validamos que los campos no esten vacios 

        if (!datos.Gmail || !datos.password){
            errorMsg.textContent="por favor complete los datos requeridos";
            errorDiv.classList.remove('hidden');
            return;
        }

        // cambia el boton mientras procesa
        btn.Disabled=true;
        btn.textContent="iniciando sesion...";

        // enviamos los datos al servidor
        try {
            const response = await fetch(API_URL,{
                method:'POST',
                headers:{'content-type':'application/json'},
                body:JSON.stringify(datos)
            });
            // recibir respuesta del servidor 
            const resultado = await response.json();

            if (response.ok){
                console.log('✅ 201- inicio de sesion exitoso');

                // guardar informacion 
                localStorage.setItem("sesionActiva", "true");
                localStorage.setItem("usuario",JSON.stringify({
                    id: resultado.usuario.id,
                    Nombre: resultado.usuario.Nombre,
                    Apellido: resultado.usuario.Apellido,
                    Gmail: resultado.usuario.Gmail,
                    Telefono: resultado.usuario.Telefono
                }));

                // mensaje de exito
                errorDiv.className='bg-green-100 border-green-200  text-green-800 px-4 py-3 rounded-lg';
                errorMsg.textContent="inicio de sesion exitoso, redireccionando...";
                errorDiv.classList.remove('hidden');

                // redirigir a productos
                setTimeout(()=>window.location.href='productod.html',8000);

                // credenciales incorrectas
            } else {
                errorDiv.textContent=resultado.message || 'credenciales incorrectas';
                errorDiv.classList.remove('hidden');
                btn.Disabled=false;
                btn.innerHTML='iniciar seision';
            }

            // si no hay conexion al servidor
        } catch (error) {
            console.error('❌ error 404- error de conexion con el servidor');
            errorDiv.textContent='error de conexion con el servidor';
            errorDiv.classList.remove('hidden');
            btn.Disabled=false;
            btn.innerHTML='iniciar seision';
        }
    })
})