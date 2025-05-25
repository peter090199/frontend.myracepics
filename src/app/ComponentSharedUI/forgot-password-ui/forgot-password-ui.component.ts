import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignUpService } from 'src/app/services/SignUp/sign-up.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ForgetPasswordService } from 'src/app/services/Password/Forget/forget-password.service';

@Component({
  selector: 'app-forgot-password-ui',
  templateUrl: './forgot-password-ui.component.html',
  styleUrls: ['./forgot-password-ui.component.css']
})
export class ForgotPasswordUIComponent implements OnInit {

  isLoading: boolean = false;
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private signUpService: SignUpService,
    private notificationsService: NotificationsService,
    private dialog: MatDialog,
    private route: Router,
    private forget: ForgetPasswordService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

 progressValue: number = 0;
intervalId: any;

onSubmit() {
  if (this.loginForm.valid) {
    this.isLoading = true;
    this.progressValue = 0;

    // Simulate loading progress
    this.intervalId = setInterval(() => {
      if (this.progressValue < 100) {
        this.progressValue += 10;
      }
    }, 200);

    const email = this.loginForm.get('email')?.value;
    this.forget.forgotPassword(email).subscribe({
      next: (res) => {
        clearInterval(this.intervalId);
        this.progressValue = 100;
        this.notificationsService.toastrSuccess(res.message);
        this.loginForm.reset();
        setTimeout(() => this.isLoading = false, 500); // short delay to complete bar
      },
      error: (error) => {
        clearInterval(this.intervalId);
        this.progressValue = 0;
        this.isLoading = false;
        this.notificationsService.toastrError("Something went wrong.");
      }
    });
  }
}

}
