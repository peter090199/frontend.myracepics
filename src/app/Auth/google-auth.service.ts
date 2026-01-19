import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { _url } from 'src/global-variables';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  constructor(private http: HttpClient) {}

  loginWithGoogle(): void {
    window.location.href = `${_url}auth/google/redirect`;
  }

handleGoogleCallback(code: any): Observable<any> {
    return this.http.get(`${_url}auth/google/callback?code=${code}`);
}

}
