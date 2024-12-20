/* self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
      body: data.descripcion,
      icon: 'assets/img/insidencia.png', // Ícono para la notificación
      data: { url: '/' }, // URL para redireccionar al abrir la notificación
  };

  event.waitUntil(
      self.registration.showNotification(data.titulo, options)
  );
});

// Detectar clic en la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url;
  event.waitUntil(clients.openWindow(urlToOpen));
});
 */

self.addEventListener('notificationclick', (event) => {
  const url = event.notification.data.url || '/'; // Usa la URL en 'data', si no existe, redirige a '/'

  // Cerrar la notificación
  event.notification.close();

  // Abrir la URL en una nueva ventana o en la misma
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Si la ventana ya está abierta, traerla al frente
      const client = clientList.find((client) => client.url === url);
      if (client) {
        return client.focus();
      }

      // Si la ventana no está abierta, abrir una nueva
      return clients.openWindow(url);
    })
  );
});
