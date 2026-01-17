import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { SigInService } from 'src/app/services/signIn/sig-in.service';
import { SignUpService } from 'src/app/services/SignUp/sign-up.service';
import { RoleComponent } from '../role/role.component';
import { RoleselecteduiComponent } from '../role/roleselectedui/roleselectedui.component';
import { RunneruiComponent } from '../role/runnerui/runnerui.component';
import { PhotographeruiComponent } from '../role/photographerui/photographerui.component';

@Component({
  selector: 'app-signinandsignup',
  templateUrl: './signinandsignup.component.html',
  styleUrls: ['./signinandsignup.component.css'],
})
export class SigninandsignupComponent implements OnInit {

  loginForm!: FormGroup;
  signupForm!: FormGroup;

  passwordVisible = false;
  isLoading = false;
  selectedTab = 0; // 0 = Login, 1 = Register

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sigInService: SigInService,
    private alert: NotificationsService,
    private signupService: SignUpService,
     private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initForms();
  }

  /** ---------------- FORMS ---------------- */
  private initForms(): void {
    // LOGIN FORM
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // REGISTER FORM (Laravel-ready)
    this.signupForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required],
    }, {
      validators: this.passwordMatchValidator
    });
  }


  onRoleSelected(role: string) {
    if (role === 'runner') {
      this.dialog.open(RunneruiComponent, {
        width: '500px',
      });
    } else if (role === 'photographer') {
      this.dialog.open(PhotographeruiComponent, {
        width: '500px',
      });
    }
  }

// openRoleDialog(role: any) {
//   const dialogRef = this.dialog.open(RoleselecteduiComponent, {
//     width: '400px',
//     data: { role }
//   });

//   dialogRef.afterClosed().subscribe(result => {
//     console.log('Dialog closed', result);
//   });
// }



  //   /** LOGIN SUBMIT */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.sigInService.signin(email, password).subscribe({
      next: (res: any) => {
        console.log(res);
        this.isLoading = false;
        this.alert.toastrSuccess("Login successful!");

        if (!res || res.success !== true) {
          this.alert.toastPopUpError(
            res?.message || 'Login failed'
          );
          return;
        }

        // 🔐 STORE AUTH DATA
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('role', res.role);
        sessionStorage.setItem('is_online', String(res.is_online ?? true));
        localStorage.setItem('chatmessages', 'true');

        // 🚦 REDIRECT BY ROLE
        switch (res.role) {
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
        this.isLoading = false;

        const errorMsg =
          err.status === 401
            ? err.error?.message || 'Invalid email or password'
            : err.message || 'Something went wrong';

        this.alert.toastPopUpError(errorMsg);
      },
    });
  }

  /** ---------------- REGISTER ---------------- */
  onSignup(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    this.signupService.signup(this.signupForm.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (!res?.success) {
          this.alert.toastPopUpError(res?.message || 'Registration failed');
          return;
        }

        this.alert.toastrSuccess('Registration successful. Please login.');
        this.signupForm.reset();
        this.selectedTab = 0;
      },
      error: (err) => {
        this.isLoading = false;
        this.alert.toastPopUpError(
          err.error?.message || 'Registration failed'
        );
      }
    });
  }

  /** ---------------- HELPERS ---------------- */
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
  }

  switchToSignUp(): void {
    this.selectedTab = 1;
  }

  redirectByRole(role: string): void {
    switch (role) {
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
        this.router.navigate(['/']);
    }
  }

  /** ---------------- VALIDATORS ---------------- */
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirm = control.get('password_confirmation')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  // openRoleDialog(): void {
  //   const dialogRef = this.dialog.open(RoleselecteduiComponent, {
  //     width: '900px',
  //     disableClose: true
  //   });

  //   dialogRef.afterClosed().subscribe(role => {
  //     if (!role) return;

  //     this.signupForm.patchValue({ role });

  //     // Now submit normally
  //     this.onSignup();
  //   });
  // }



}
