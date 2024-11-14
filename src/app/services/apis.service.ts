import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApisService {

  constructor(private http: HttpClient) { }
/*   private apiURL = 'http://localhost:3000' */
  private apiURL = 'https://cbtis248back.onrender.com'

  login(credentials: { correo_electronico: string; password: string }) {
    return this.http.post(`${this.apiURL}/api/auth/login`, credentials);
  }

  getAdministrativos() { //ESTE ES LA API PARA MANDAR A LLAMAR A LOS TUTORES
    return this.http.get(`${this.apiURL}/api/administrativos`)
  }

  getIncidencia() { //ESTE ES LA API PARA MANDAR A LLAMAR A LOS TUTORES
    return this.http.get(`${this.apiURL}/api/tipo-incidencias`)
  }

  getGrupos(): Observable<any[]> { //ESTE ES LA API PARA MANDAR A LLAMAR A LOS TUTORES
    return this.http.get<any[]>(`${this.apiURL}/api/grupos`)
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
    return this.http.get<any[]>(`${this.apiURL}/api/usuarios`);
  }

  getAlumnosRespo() { // Tipamos la respuesta como Observable<any[]>
    return this.http.get(`${this.apiURL}/api/alumno-responsable`)
  }

  postAdministrativos(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiURL}/api/administrativos`, formData);
  }
  postAlumnos(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiURL}/api/alumnos`, formData);

  }

  postAvisos(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiURL}/api/avisos`, formData);
  }

  postTutor(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiURL}/api/responsables`, formData);
  }

  postIncidencia(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiURL}/api/incidencias`, formData);
  }

  getResponsableById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/api/responsables/${id}`);
  }
  getAlumnoById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/api/alumnos/${id}`);
  }
  getAdministrativoById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/api/administrativos/${id}`);
  }

}
