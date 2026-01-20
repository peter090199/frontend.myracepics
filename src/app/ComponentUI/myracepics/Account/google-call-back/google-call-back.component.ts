// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { GoogleAuthService } from 'src/app/services/google/google-auth.service';

// @Component({
//   selector: 'app-google-call-back',
//   templateUrl: './google-call-back.component.html',
//   styleUrls: ['./google-call-back.component.css']
// })
// export class GoogleCallbackComponent implements OnInit {

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private googleAuths: GoogleAuthService
//   ) { }

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       const token = params['token'];   // corrected key
//       const userId = params['user_id'];
//       const error = params['error'];

//       if (token) {
//         // save token to session or local storage
//         sessionStorage.setItem('token', token);
//         sessionStorage.setItem('user_id', userId);

//         console.log(token)
//         return;

//         // optional: call API to verify token
//         this.googleAuths.handleGoogleCallback(token).subscribe({
//           next: (res) => {
//             console.log('Google login successful:', res);
//             sessionStorage.setItem('token', res.token); // optional if backend returns a token
//             this.router.navigate(['/runner/allevents']); // redirect after login
//           },
//           error: (err) => {
//             console.error('Google login failed', err);
//           //  this.router.navigate(['/login']);
//           }
//         });
//       }

//       if (error) {
//         console.error('Google login error:', error);
//         this.router.navigate(['/login']); // redirect to login on error
//       }
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GoogleAuthService } from 'src/app/services/google/google-auth.service';

@Component({
  selector: 'app-google-call-back',
  templateUrl: './google-call-back.component.html',
  styleUrls: ['./google-call-back.component.css']
})
export class GoogleCallbackComponent implements OnInit {
  roleForm!: FormGroup;
  userId!: string;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: GoogleAuthService
  ) { }

  ngOnInit(): void {
    // Get user_id from query params
    this.userId = this.route.snapshot.queryParamMap.get('user_id') || '';

    this.roleForm = this.fb.group({
      role: ['', Validators.required]
    });
  }

  submitRole(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.roleForm.value;

    this.authService.setRole(this.userId, this.roleForm.value.role).subscribe({
      next: (res: any) => {
        console.log(res);
        this.loading = false;
       // this.alert.toastrSuccess("Login successful!");

        // if (!res || res.success !== true) {
        //   this.alert.toastPopUpError(
        //     res?.message || 'Login failed'
        //   );
        //   return;
        // }

        // 🔐 STORE AUTH DATA
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('role', res.user.role);
        sessionStorage.setItem('is_online', String(res.is_online ?? true));
        localStorage.setItem('chatmessages', 'true');

        // 🚦 REDIRECT BY ROLE
        switch (res.user.role) {
          case 'admin':
            this.router.navigate(['/admin/admin-dashboard']);
            break;
          case 'masteradmin':
            this.router.navigate(['/masteradmin/admin-dashboard']);
            break;
          case 'photographer':
            this.router.navigate(['/photographer/allevents']);
            break;
          case 'runner':
            this.router.navigate(['/runner/allevents']);
            break;
          default:
            this.router.navigate(['/']); // fallback
        }
      },
      error: (err) => {
        this.loading = false;

        const errorMsg =
          err.status === 401
            ? err.error?.message || 'Invalid email or password'
            : err.message || 'Something went wrong';

       // this.alert.toastPopUpError(errorMsg);
      },
    });
  }

  submitRole1() {
    if (this.roleForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      user_id: this.userId,
      role: this.roleForm.value.role
    };
    this.authService.setRole(this.userId, this.roleForm.value.role)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          localStorage.setItem('token', res.token);
          this.router.navigate(['/']); // redirect to dashboard/home
        },
        error: (err: { error: { message: string; }; }) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Failed to set role.';
        }
      });
  }
}

