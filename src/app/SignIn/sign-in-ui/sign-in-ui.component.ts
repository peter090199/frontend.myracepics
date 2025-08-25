// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { NotificationsService } from 'src/app/services/Global/notifications.service';
// import { SigInService } from 'src/app/services/signIn/sig-in.service';
// import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';

// @Component({
//   selector: 'app-sign-in-ui',
//   templateUrl: './sign-in-ui.component.html',
//   styleUrls: ['./sign-in-ui.component.css']
// })
// export class SignInUIComponent implements OnInit {
//   loginForm!: FormGroup;
//   isLoading = false;
//   hide = true; // For password visibility toggle
//   checked = false; // Remember me checkbox
//   passwordVisible: boolean = false;
//   isLoggedIn: boolean = false; // Track login status
//   showChatButton: boolean = true; // Default visibility
//   isLoginSuccessful = false;
//   user:any;
//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private sigInService: SigInService,
//     private notificationService: NotificationsService,
//     private userServices:CurriculumVitaeService
//   ) {}

//   ngOnInit(): void {
//     this.initializeForm();
//     this.fetchProfilePicture();
//   }
  
//   fetchProfilePicture(): void {
//     this.userServices.getDataCV().subscribe(
//       (res) => {
//         if (res && res.message) {
//           this.user = res.message;
  
//           // Store the 'code' in local storage
//           if (this.user.code) {
//             localStorage.setItem('code', this.user.code);
//           }
//         } else {
//           console.error('Invalid response format:', res);
//         }
//       },
//       (error) => {
//         console.error('Error fetching CV data:', error);
//       }
//     );
//   }
  

//   refreshHomePage() {
//     this.router.navigate(['/homepage']).then(() => {
//       window.location.reload();
//     });
//   }



//   // Initialize the login form
//   private initializeForm(): void {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [
//         Validators.required,
//         Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
//       ]]
//     });
//   }

//   simulateLogin(email: string, password: string): Promise<boolean> {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         // Simulate incorrect password (replace with real validation logic)
//         resolve(password === 'correct-password');
//       }, 1000);
//     });
//   }

//   togglePasswordVisibility() {
//     this.passwordVisible = !this.passwordVisible;
//   }
//   status: string = "";


//   showChatButtonUI() {
//     this.isLoggedIn = true;
//     localStorage.setItem('isLoggedIn', 'true'); // Save login state
//     this.showChatButton = true; // Show chat button
//     localStorage.setItem('showChatButton', JSON.stringify(true));
//     localStorage.removeItem('showWebsiteChat');
//     // localStorage.setItem('showWebsiteChat', JSON.stringify(false));

//   }

//   reloadOnce() {
//     location.reload(); 
//   }

//   // Handle form submission
//   onSubmit(): void {
//     if (this.loginForm.valid) {
//       this.isLoading = true;
  
//       const { email, password } = this.loginForm.value;
  
//       setTimeout(() => {
//         this.sigInService.signin(email, password).subscribe({
//           next: (res) => {
//             if (res.success && res.token) {
//               this.isLoading = false;
//               this.isLoginSuccessful = true;
//               if (res.message === 0) {
//              //   this.router.navigate(['/home']);
//                 this.router.navigate(['/home']).then(() => this.reloadOnce());
//               } else {
//                // this.router.navigate(['/user-cv']);
//                 this.router.navigate(['/user-cv']).then(() => this.reloadOnce());
//               }
//               this.loginForm.reset();
//               this.showChatButtonUI();
//               setTimeout(() => {
//                 this.isLoginSuccessful = false;
//               }, 1000);
//             } else {
//               this.isLoading = false;
//               this.notificationService.toastPopUpError(res.message);
//             }
//           },
//           error: (err) => {
//             if (err.status === 401) {
//               this.notificationService.toastrError(err.error);
//             } else {
//               this.notificationService.toastPopUpError(err.message);
//             }
//             this.isLoading = false; 
//           },
//           complete: () => {
//             this.isLoading = false;
//           }
//         });
//       }, 2000); 
//     } else {
//       this.isLoading = false;
//     }
//   }

  


// }


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { SigInService } from 'src/app/services/signIn/sig-in.service';

@Component({
  selector: 'app-sign-in-ui',
  templateUrl: './sign-in-ui.component.html',
  styleUrls: ['./sign-in-ui.component.css']
})
export class SignInUIComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  hide = true;
  passwordVisible: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sigInService: SigInService,
    private notificationService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/)
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      //  Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/)
      ]]
    });
  }
  togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
      }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.loginForm.value;
    console.log(this.loginForm.value)
    this.sigInService.signin(email, password).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success == true) {
          sessionStorage.setItem('token', res.token);
          localStorage.setItem("chatmessages", "true");
          if(res.message == 0)
          {
            this.router.navigateByUrl("/home")
            // this.router.navigateByUrl("/home").then(() => {
            //   window.location.reload(); // Only if absolutely necessary
            // });
          }
           if(res.message == 1)
          {
            this.router.navigateByUrl("/user-cv")
          }

          // const targetRoute = res.message === 1 ? '/home' : '/user-cv';
          // this.router.navigate([targetRoute]).then(() => location.reload());
        } else {
          this.notificationService.toastPopUpError(res.message);
        }
      },
      error: (err) => {
        this.isLoading = false;
        const errorMsg = err.status === 401 ? err.error : err.message;
        this.notificationService.toastPopUpError(errorMsg);
      }
    });
  }
}
