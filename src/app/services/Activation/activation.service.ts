import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { _url } from 'src/global-variables';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class ActivationService {
 private clientId = '4279998619-tp60bk1m6g653lmep6djmb03ad844o5q.apps.googleusercontent.com';

  constructor(private http: HttpClient) {}

  activate(payload: { email: string, code: string}): Observable<any> {
    return this.http.post<any>(`${_url}accountactivation`, payload);
  }


   // Initialize Google One-Tap or button login
  initializeGoogleButton(buttonId: string, callback: (response: any) => void) {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback
    });

    google.accounts.id.renderButton(
      document.getElementById(buttonId),
      { theme: 'outline', size: 'large', width: '100%' }
    );
  }
  
loginWithGoogle(token: string) {
  return this.http.post(`${_url}auth/google`, { token });
}


}
