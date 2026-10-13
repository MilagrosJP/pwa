// Activar el Service Worker de inmediato
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// El navegador dispara este evento cuando vuelve la conexión
self.addEventListener('sync', (event) => {
  console.log('¡Evento sync recibido en la tienda!', event.tag);

  if (event.tag === 'tienda-deportiva-sync') {
    event.waitUntil(enviarPedidoTienda());
  }
});

async function enviarPedidoTienda() {
  try {
    const respuesta = await fetch('datos.json'); // Simula enviar el pedido al servidor
    if (!respuesta.ok) {
      throw new Error('Falló el envío del pedido'); // Reintentará si falla
    }
    await avisarALaPagina('✅ ¡Pedido de GlamFit Sport procesado con éxito!');
  } catch (error) {
    console.error(error);
    throw error; // Fuerza al navegador a reintentar el sync más tarde
  }
}

// Envía un mensaje a todas las pestañas abiertas
async function avisarALaPagina(texto) {
  const ventanas = await self.clients.matchAll();
  ventanas.forEach((ventana) => ventana.postMessage(texto));
}