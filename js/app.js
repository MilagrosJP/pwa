const estado = document.getElementById('estado');
const bannerConexion = document.getElementById('conexion-banner');

// 1) Registrar el Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');

  // 2) Escuchar los mensajes que mande el Service Worker
  navigator.serviceWorker.addEventListener('message', (e) => {
    estado.textContent = e.data;
    mostrarNotificacionLocal(e.data);
  });
}

// Control de estado de conexión a Internet (Online / Offline)
function actualizarEstadoConexion() {
  if (navigator.onLine) {
    bannerConexion.textContent = 'Conectado a la red 🟢';
    bannerConexion.className = 'online';
  } else {
    bannerConexion.textContent = '⚠️ Sin conexión a internet (Modo Offline)';
    bannerConexion.className = 'offline';
  }
}

window.addEventListener('online', actualizarEstadoConexion);
window.addEventListener('offline', actualizarEstadoConexion);
actualizarEstadoConexion();

// Notificaciones del navegador
function mostrarNotificacionLocal(mensaje) {
  if (Notification.permission === 'granted') {
    new Notification('GlamFit Sport', {
      body: mensaje,
      icon: 'icon-192.png'
    });
  }
}

if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission();
}

// 3) Programar los botones de compra para pedir sincronización
const botonesComprar = document.querySelectorAll('.btn-comprar');

botonesComprar.forEach(btn => {
  btn.addEventListener('click', async () => {
    const productoNombre = btn.getAttribute('data-producto');
    const registro = await navigator.serviceWorker.ready;

    if ('sync' in registro) {
      await registro.sync.register('tienda-deportiva-sync');
      estado.textContent = `🛍️ Pedido de "${productoNombre}" guardado. Te avisaremos al recuperar la conexión.`;
    } else {
      estado.textContent = 'Tu navegador no soporta Background Sync (usa Chrome o Edge).';
    }
  });
});