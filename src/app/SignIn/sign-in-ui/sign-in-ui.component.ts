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
  hide = true; // For password visibility toggle
  checked = false; // Remember me checkbox
  passwordVisible: boolean = false;
  isLoggedIn: boolean = false; // Track login status
  showChatButton: boolean = true; // Default visibility
  isLoginSuccessful = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sigInService: SigInService,
    private notificationService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  refreshHomePage() {
    this.router.navigate(['/homepage']).then(() => {
      window.location.reload();
    });
  }



  // Initialize the login form
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ]]
    });
  }

  simulateLogin(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate incorrect password (replace with real validation logic)
        resolve(password === 'correct-password');
      }, 1000);
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  status: string = "";


  showChatButtonUI() {
    this.isLoggedIn = true;
    localStorage.setItem('isLoggedIn', 'true'); // Save login state
    this.showChatButton = true; // Show chat button
    localStorage.setItem('showChatButton', JSON.stringify(true));
    localStorage.removeItem('showWebsiteChat');
    // localStorage.setItem('showWebsiteChat', JSON.stringify(false));


  }

  reloadOnce() {
    location.reload(); 
  }
  


  // Handle form submission
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
  
      const { email, password } = this.loginForm.value;
  
      // Simulate a login process delay (optional, can be removed or adjusted)
      setTimeout(() => {
        this.sigInService.signin(email, password).subscribe({
          next: (res) => {
            if (res.success && res.token) {
              // Handle successful login response
              this.isLoading = false;
              this.isLoginSuccessful = true;
  
              // Navigate based on user role/message
              if (res.message === 0) {
             //   this.router.navigate(['/home']);
                this.router.navigate(['/home']).then(() => this.reloadOnce());
              } else {
               // this.router.navigate(['/user-cv']);
                this.router.navigate(['/user-cv']).then(() => this.reloadOnce());
              }
  
              // Reset form and show chat button UI after successful login
              this.loginForm.reset();
              this.showChatButtonUI();
  
              // Hide the overlay after 3 seconds
              setTimeout(() => {
                this.isLoginSuccessful = false;
              }, 1000);
            } else {
              // Handle unsuccessful login response
              this.isLoading = false;
              this.notificationService.toastPopUpError(res.message);
            }
          },
          error: (err) => {
            // Handle error response
            if (err.status === 401) {
              this.notificationService.toastrError(err.error);
            } else {
              this.notificationService.toastPopUpError(err.message);
            }
            this.isLoading = false; // Stop loading on error
          },
          complete: () => {
            this.isLoading = false; // Stop loading on completion
          }
        });
      }, 2000); // Simulated login delay
    } else {
      // If form is invalid, stop loading and possibly show validation messages
      this.isLoading = false;
    }
  }

  


}
