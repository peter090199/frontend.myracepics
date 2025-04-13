import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap, of } from 'rxjs';
import { _url } from 'src/global-variables';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SigInService {
  private tokenKey = 'token';
  private _refreshrequired=new Subject<void>();

  get RequiredRefresh(){
    return this._refreshrequired;
  }
  constructor(private http: HttpClient) {
    
   }
  // Get token from local storage
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  // Save token to local storage
  private saveToken(token: string): void {
      sessionStorage.setItem(this.tokenKey,token);
  }

  // Login method
  signin(email: any, password: any): Observable<any> {
    return this.http.post<any>(_url + 'login', { email, password }).pipe(
      tap(res => {
        if (res && res.token) {
          this.saveToken(res.token);
          this._refreshrequired.next();
         // this.startTokenExpirationCheck(); // Restart token expiration check on login
        }
      }),
      catchError(this.handleError())
    );
  }


  setActiveSignIn(email: any): Observable<any> {
  return this.http.post<any>(_url + 'accountactivation', { email }).pipe(
    tap(res => {
      if (res && res.token) {
        this.saveToken(res.token);
        this._refreshrequired.next();
        //this.startTokenExpirationCheck(); // Restart token expiration check on login
      }
    }),
    catchError(this.handleError())
  );
}

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
      } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
      }
    }
    return null;
  }

  createHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  
   // Logout method
   logout(): Observable<any> {
    return this.http.post(`${_url}logout`, {}, { headers: this.createHeaders() }).pipe(
      tap(() => {
        sessionStorage.clear();
        this._refreshrequired.next();
      }),
      catchError(this.handleError('logout'))
    );
  }
  

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); 
      return of(result as T);
    };
  }

  
}


