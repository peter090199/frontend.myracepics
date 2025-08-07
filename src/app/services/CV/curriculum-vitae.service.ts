import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { _url } from 'src/global-variables';


@Injectable({
  providedIn: 'root'
})
export class CurriculumVitaeService {

  constructor(private http: HttpClient) { }

  private getAuthToken(): string {
    return sessionStorage.getItem('token') || ''; // Fetch the token from localStorage or other storage
  }


  private createHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      //'Content-Type': 'application/json'
    });
  }



  private createParams(): HttpParams {
    return new HttpParams().set('desc_code', 'top_navigation');
  }

  getProfileByUser(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${_url}profile`, { headers }).pipe(
      catchError(error => this.handleAuthError(error))
    );
  }

  private handleAuthError(error: any): Observable<any> {
    if (error.status === 401) {
      console.error('Unauthorized: Please log in.');
      alert('Unauthorized access. Please log in again.');
    } else if (error.status === 403) {
      console.error('Forbidden: You do not have permission to access this resource.');
      alert('Forbidden: You do not have the required permissions.');
    } else {
      console.error('An error occurred:', error.message);
      alert('An unexpected error occurred. Please try again.');
    }
    return of(null); // Return an observable with a fallback value
  }

  getData(): Observable<any> {
    const headers = this.createHeaders();
    const params = this.createParams();
    return this.http.get(`${_url}accessmenu`, { headers, params });
  }


  getSecurityRolesByDesc_Code(rolecode: string): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${_url}security/${rolecode}`, { headers });
  }

  postCV2(mergedData: any): Observable<any> {
    const token = this.getAuthToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${_url}profile`, mergedData, { headers });
  }

  postCV(payload: FormData): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<any>(`${_url}profile`, payload, { headers });
  }

  uploadCV(payload: FormData): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<any>(`${_url}profile_pic`, payload, { headers });
  }

  putData(endpoint: string, body: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.put(`${_url}${endpoint}`, body, { headers });
  }

  saveProfile(formData: FormData): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<any>(`${_url}saveProfile`, formData, { headers });
  }


  deleteData(endpoint: string): Observable<any> {
    const headers = this.createHeaders();
    return this.http.delete(`${_url}${endpoint}`, { headers });
  }

  submitData(formData: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post(`${_url}security`, formData, { headers });
  }


  getDataCV(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${_url}profile`, { headers });
  }

  saveLanguages(languages: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<any>(`${_url}saveLanguage`, languages, { headers });
  }


  getLanguages(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${_url}getLanguagesByCode`, { headers });
  }

  deleteLanguage(id: number): Observable<any> {
    const headers = this.createHeaders();
    const url = `${_url}deleteLanguageById/${id}`;
    return this.http.delete(url, { headers });
  }
  //education
   saveEducations(educations: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<any>(`${_url}saveEducation`, educations, { headers });
  }
  updateEducationById(id: number, data: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.put(`${_url}updateEducationById/${id}`, data, { headers });
  }

  deleteEduc(id: number): Observable<any> {
    const headers = this.createHeaders();
    const url = `${_url}deleteEducation/${id}`;
    return this.http.delete(url, { headers });
  }
  getEducationsByCode(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${_url}getEducationsByCode`, { headers });
  }

  //skills
  saveSkills(skills: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<any>(`${_url}saveSkills`, skills, { headers });
  }
  getSkills(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${_url}getSkills`, { headers });
  }
  deleteSkills(id: number): Observable<any> {
    const headers = this.createHeaders();
    const url = `${_url}deleteSkills/${id}`;
    return this.http.delete(url, { headers });
  }
  //seminar
  saveSeminar(seminars: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<any>(`${_url}saveSeminar`, seminars, { headers });
  }
  getSeminarByCode(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${_url}getSeminarByCode`, { headers });
  }
  deleteSeminar(id: number): Observable<any> {
    const headers = this.createHeaders();
    const url = `${_url}delete/${id}`;
    return this.http.delete(url, { headers });
  }


}
