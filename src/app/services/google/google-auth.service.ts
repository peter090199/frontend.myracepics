import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { _url } from 'src/global-variables';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  constructor(private http: HttpClient) { }

  loginWithGoogle(): void {
    window.location.href = `${_url}auth/google/redirect`;
  }

  handleGoogleCallback(token: any): Observable<any> {
    return this.http.get(`${_url}auth/google/callback?token=${token}`);
  }

    /**
   * Set Google user role
   * @param userId Google user ID
   * @param role 'runner' | 'photographer'
   */
  setRole(userId: string, role: string): Observable<any> {
    const payload = { user_id: userId, role };
    return this.http.post(`${_url}auth/google/set-role`, payload);
  }

}
