import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApisService {

  constructor(private http: HttpClient) { }
  private apiURL = 'http://localhost:3000'

  login(credentials: { correo_electronico: string; password: string }) {
    return this.http.post(`${this.apiURL}/api/auth/login`, credentials);
  }

  getAdministrativos() { //ESTE ES LA API PARA MANDAR A LLAMAR A LOS TUTORES
    return this.http.get(`${this.apiURL}/api/administrativos`)
  }

  getIncidencia() { //ESTE ES LA API PARA MANDAR A LLAMAR A LOS TUTORES
    return this.http.get(`${this.apiURL}/api/tipo-incidencias`)
  }

  getGrupos() { //ESTE ES LA API PARA MANDAR A LLAMAR A LOS TUTORES
    return this.http.get(`${this.apiURL}/api/grupos`)
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURL}/api/roles`);
  }

  getResponsables() { //ESTE ES LA API PARA MANDAR A LLAMAR A LOS TUTORES
    return this.http.get(`${this.apiURL}/api/responsables`)
  }

  getAlumnos() { //ESTE ES LA API PARA MANDAR A LLAMAR A LOS TUTORES
    return this.http.get(`${this.apiURL}/api/alumnos`)
  }

  getAvisos(): Observable<any[]> { // Tipamos la respuesta como Observable<any[]>
    return this.http.get<any[]>(`${this.apiURL}/api/avisos`);
  }

  getUsuarios() { // Tipamos la respuesta como Observable<any[]>
    return this.http.get<any[]>(`${this.apiURL}/api/usuarios`)
  }

  getAlumnosRespo() { // Tipamos la respuesta como Observable<any[]>
    return this.http.get(`${this.apiURL}/api/alumno-responsable`)
  }

/*   crearTutors(data: FormData) { //ESTE ES LA API PARA CREAR A LOS TUTORES
    console.log(data)
    return this.http.post(`${this.apiURL}/api/tutors`, data)
  }
 */
  postAdministrativos(data: any) {
    return this.http.post('http://localhost:3000/api/administrativos', data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  postAvisos(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/api/avisos`, data);
  }

  /*   postTutor(data: any): Observable<any> {
      return this.http.post(`${this.apiURL}/api/responsables`, data);
    } */

  postTutor(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiURL}/api/responsables`, formData);
  }

  postIncidencia(data: any): Observable<any> {
    return this.http.post(`${this.apiURL}/api/incidencias`, data);
  }

}