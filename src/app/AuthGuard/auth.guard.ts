import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { _url } from 'src/global-variables';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  constructor(private router: Router, private http:HttpClient) {}
  
  private isUserOnline = new BehaviorSubject<boolean>(false);
  canActivate(): boolean {
    // Check if the token exists (or use an authentication service to verify)
    const token = localStorage.getItem('token');
    
    if (token) {
      return true; // Allow access if the user is authenticated
    } else {
      this.router.navigate(['/homepage']); // Redirect to sign-in page if not authenticated
      return false;
    }
  }

  // logout(): void {
  //   localStorage.removeItem('token');
  //   this.router.navigate(['/homepage']);
  // }



  logout(): Observable<any> {
    return this.http.post(`${_url}logout`, {}).pipe(
      tap({
        next: () => {
          localStorage.removeItem('token'); 
          this.isUserOnline.next(false);
          this.router.navigate(['/homepage']);
        },
        error: (error) => {
          console.error('Logout failed:', error);
        }
      }),
      catchError((error) => {
        console.error('Error during logout:', error);
        return throwError(() => error); // Ensure the error propagates
      })
    );
  }
  
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserId(): number {
    return Number(localStorage.getItem('userId')) || 0; // Get user ID from storage or API
  }

}
