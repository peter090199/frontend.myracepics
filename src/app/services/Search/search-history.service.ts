import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class SearchHistoryService {
  RequiredRefresh: any;

  // Inject HttpClient into the constructor
  constructor(private http: HttpClient) { }

  // Method to get the authentication token from localStorage or another method
  private getAuthToken(): string {
    return sessionStorage.getItem('token') || ''; // Fetch the token from localStorage or other storage
  }

  // Method to create HTTP headers with the Bearer token
  private createHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Method to create HTTP params with the desc_code
  private createParams(): HttpParams {
    return new HttpParams().set('desc_code', 'top_navigation');
  }

  // Example of a GET request
  getSearchHistory(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${_url}getSearchHistory`, { headers });
  }
  saveSearch(role: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<any>(`${_url}saveSearchHistory`, role, { headers });
  }


  clearHistory(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.delete(`${_url}deleteSearchHistory`, { headers });
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // Log the error for debugging
      return of(result as T);
    };
  }

}
