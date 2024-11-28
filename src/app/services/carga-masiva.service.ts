import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CargaMasivaService {
/*   private apiUrl = 'http://localhost:3000/api/carga-masiva'; */
  private apiUrl = 'http://3.21.170.124:3000/api/carga-masiva';

  constructor(private http: HttpClient) { }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    // Indicar que la respuesta esperada es texto
    return this.http.post(`${this.apiUrl}/subir`, formData, { responseType: 'text' });
  }
}
