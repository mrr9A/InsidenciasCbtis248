import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment.prod';

if ('serviceWorker' in navigator && environment.production) {
  navigator.serviceWorker.register('/ngsw-worker.js').then((registration) => {
    console.log('Service Worker registrado:', registration);
  }).catch((error) => {
    console.error('Error al registrar el Service Worker:', error);
  });
}


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


