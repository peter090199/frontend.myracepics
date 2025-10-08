import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class PostReactionByIdService {

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

  saveReaction(postId: number, reaction: string): Observable<any> {
    const headers = this.createHeaders();
    const payload = { post_id: postId, reaction };
    return this.http.post(`${_url}reactToPostById`, payload, { headers }).pipe(
      catchError(error => this.handleAuthError(error)) // handle API errors
    );
  }

  getReaction(postId: number): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get<any>(`${_url}getReactionByPostId/${postId}`, { headers });
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

}
