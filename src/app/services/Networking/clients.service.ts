import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  RequiredRefresh: any;

  constructor(private http: HttpClient) { }

  private getAuthToken(): string {
    return sessionStorage.getItem('token') || ''; // Fetch the token from localStorage or other storage
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

  getListClients(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${_url}getListClients`, { headers });
  }

  getPendingFollowStatus(code: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get<any>(`${_url}getPendingFollowStatus/${code}`, { headers });
  }


  getFollowStatus(code: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get<any>(`${_url}getFollowStatus/${code}`, { headers });
  }

  getPendingFollowRequests(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get<any>(`${_url}getPendingFollowRequests`, { headers });
  }
  getfollowingPending(): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get<any>(`${_url}getfollowingPending`, { headers });
  }

  acceptFollowRequest(followerCode: any) {
    const headers = this.createHeaders();
    return this.http.put(`${_url}acceptFollowRequest/${followerCode}`, {}, { headers });
  }

  // postData(role: any): Observable<any> {
  //   const headers = this.createHeaders();
  //   return this.http.post<any>(`${_url}role`, role, { headers });
  // }

  // putData(id: string, body: any): Observable<any> {
  //   const headers = this.createHeaders();
  //   return this.http.put(`${_url}role/${id}`, body, { headers });
  // }

  // deleteData(id: string): Observable<any> {
  //   const headers = this.createHeaders();
  //   return this.http.delete(`${_url}role/${id}`, { headers });
  // }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // Log the error for debugging
      
      return of(result as T);
    };
  }

}
