import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

constructor(private http: HttpClient) {}

  loginWithGoogle() {
    window.location.href = 'http://localhost:8000/auth/google/redirect';
  }
}
