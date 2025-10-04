// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserServicesService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService   {
  RequiredRefresh: any;
  constructor(private http: HttpClient) { }
  private getAuthToken(): string {
    return sessionStorage.getItem('token') || '';
  }
  private createHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  private createParams(): HttpParams {
    return new HttpParams().set('desc_code', 'top_navigation');
  }
  getUsers(): Observable<any> {
    const headers = this.createHeaders(); 
    return this.http.get<any>(`${_url}getUsers`, { headers });
  }

  saveSubmenu(data: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<any>(`${_url}saveSubmenus`, data, { headers });
  }
  updateSubmenu(id: number, data: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.put(`${_url}updatesubmenu/${id}`, data, { headers });
  }
  postData(role: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<any>(`${_url}role`, role, { headers });
  }
  putData(id: string, body: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.put(`${_url}role/${id}`, body, { headers });
  }
  deleteMenu(transNo: string): Observable<any> {
    const headers = this.createHeaders();
    return this.http.delete(`${_url}menu/delete/${transNo}`, { headers });
  }

 deleteSubmenu(id: number): Observable<any> {
    const headers = this.createHeaders();
    return this.http.delete(`${_url}deleteSubmenu/${id}`, { headers });
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // Log the error for debugging
      
      // Optionally, you can use toastr to show the error message here:
      // this.toastrService.error(error.message || 'An error occurred');

      // Let the app keep running by returning a safe result.
      return of(result as T);
    };
  }

}
