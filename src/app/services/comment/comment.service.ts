import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

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

  getComment(post_uuidOrUind:any): Observable<any> {
    const headers = this.createHeaders();
    const params = new HttpParams().set('post_uuidOrUind', post_uuidOrUind); 
    return this.http.get(`${_url}comment`, { headers, params });
  }

  postComment(post_uuid: any): Observable<any> {
    const headers = this.createHeaders();
    const params = new HttpParams().set('post_uuid', post_uuid); 
    return this.http.post(`${_url}comment`, { headers, params });
  }

  postCommentByReply(comment_uuid: any, comment:any): Observable<any> {
    const headers = this.createHeaders();
    const params = new HttpParams().set('comment_uuid', comment_uuid); 
    return this.http.post(`${_url}commentreply`,comment, { headers, params });
  }

  postCommentByReplyx(code:any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post(`${_url}commentreply`, { headers }).pipe(
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

}
