// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
// import { _url } from 'src/global-variables';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   // canActivate(
//   //   route: ActivatedRouteSnapshot,
//   //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//   //   return true;
//   // }
//   constructor(private router: Router, private http:HttpClient) {}
  
//   private isUserOnline = new BehaviorSubject<boolean>(false);
//   canActivate(): boolean {
//     const token = sessionStorage.getItem('token');
    
//     if (token) {
//       return true; // Allow access if the user is authenticated
//     } else {
//       this.router.navigate(['/homepage']); // Redirect to sign-in page if not authenticated
//       return false;
//     }
//   }


//   logout(): Observable<any> {
//     return this.http.post(`${_url}logout`, {}).pipe(
//       tap({
//         next: () => {
//           localStorage.removeItem('token'); 
//           this.isUserOnline.next(false);
//           this.router.navigate(['/homepage']);
//         },
//         error: (error) => {
//           console.error('Logout failed:', error);
//         }
//       }),
//       catchError((error) => {
//         console.error('Error during logout:', error);
//         return throwError(() => error); // Ensure the error propagates
//       })
//     );
//   }
  
  
//   isAuthenticated(): boolean {
//     return !!localStorage.getItem('token');
//   }

//   getUserId(): number {
//     return Number(localStorage.getItem('userId')) || 0; // Get user ID from storage or API
//   }

// }

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { _url } from 'src/global-variables';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private isUserOnline = new BehaviorSubject<boolean>(false);

  constructor(private router: Router, private http: HttpClient) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('token');

    if (token) {
      return true;
    } else {
      this.router.navigate(['/homepage']);
      return false;
    }
  }

logout(): Observable<any> {
  return this.http.post(`${_url}logout`, {}).pipe(
    map((res: any) => {
      // ✅ Clear session and reset states only if logout succeeds
      sessionStorage.clear();
      localStorage.setItem('showWebsiteChat', JSON.stringify(true));
      localStorage.setItem('cookiesAccepted', JSON.stringify(true));

      this.isUserOnline.next(false);
      this.router.navigate(['/homepage']);

      return res; // pass response to subscriber if needed
    }),
    catchError((error) => {
      console.error('Error during logout:', error);
      return throwError(() => error);
    })
  );
}

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }

  getUserId(): number {
    return Number(sessionStorage.getItem('userId')) || 0;
  }
}
