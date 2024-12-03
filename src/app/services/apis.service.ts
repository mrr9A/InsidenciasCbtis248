import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApisService {

  constructor(private http: HttpClient) { }
  private apiURL = 'http://localhost:3000'
/*   private apiURL = 'http://3.21.170.124:3000' */

  login(credentials: { correo_electronico: string; password: string }) {
    return this.http.post(`${this.apiURL}/api/auth/login`, credentials);
  }

  getAdministrativos() { //ESTE ES LA API PARA MANDAR A LLAMAR A LOS TUTORES
    return this.http.get(`${this.apiURL}/api/administrativos`)
  }

  getIncidencia() { //ESTE ES LA API PARA MANDAR A LLAMAR A LOS TUTORES
    return this.http.get(`${this.apiURL}/api/tipo-incidencias`)
  }

  getincidencia() { //ESTE ES LA API PARA MANDAR A LLAMAR A LOS TUTORES
    return this.http.get(`${this.apiURL}/api/incidencias`)
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
  getAvisoById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/api/avisos/${id}`);
  }
  getInsideById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/api/incidencias/${id}`);
  }
  getInsideById1(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/api/incidencias/${id}`);
  }

  deleteAviso(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/api/avisos/${id}`);
  }

  deleteIncidencia(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/api/incidencias/${id}`);
  }

  updateAlumno(id: number, formData: FormData) {
    return this.http.patch<any>(`http://localhost:3000/api/alumnos/${id}`, formData);
  }

  updateResponsable(id: number, formData: FormData) {
    return this.http.patch<any>(`http://localhost:3000/api/responsables/${id}`, formData);
  }

  getAdminis(id: number, formData: FormData) {
    return this.http.patch<any>(`http://localhost:3000/api/administrativos/${id}`, formData);
  }

  UpdateAviso(id: string, formData: FormData) {
    return this.http.patch<any>(`http://localhost:3000/api/avisos/${id}`, formData);
  }

  updateIncidencia(id: number, formData: FormData) {
    return this.http.patch<any>(`http://localhost:3000/api/avisos/${id}`, formData);
  }

  getAdminis1(id: number) {
    return this.http.get<any>(`http://localhost:3000/api/administrativos/${id}`);
  }

  getAlumnos2(): Observable<any[]> {
    return this.http.get<any[]>('API_URL');
  }

  getAlumno(id: number) {
    return this.http.get<any>(`/api/alumnos/${id}`);
  }
}
