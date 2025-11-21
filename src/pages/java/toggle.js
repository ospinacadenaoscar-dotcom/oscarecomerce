// funcion de visivilidad del ojito en el login

document.getElementById('toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const eyeopen =document.getElementById('eye-icon-open');
    const eyeclosed=document.getElementById('eye-icon-closed');

    // verificacion si la contraseña esta oculta
    const isHidden=passwordInput.type === 'password';

    // cambiar el password a text 
    passwordInput.type = isHidden ? 'text' : 'password';

    // alteracion iconos segun el estado
    eyeopen.classList.toggle('hidden', !isHidden);
    eyeclosed.classList.toggle('hidden', isHidden);
});