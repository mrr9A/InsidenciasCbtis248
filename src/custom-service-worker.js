self.addEventListener('push', (event) => {
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
