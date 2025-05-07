import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignUpService } from 'src/app/services/SignUp/sign-up.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ForgetPasswordService } from 'src/app/services/Password/Forget/forget-password.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  isLoading: boolean= false;
  loginForm!: FormGroup; // Define the form group properly
  email: string = '';

  constructor(private fb: FormBuilder, 
              private signUpService: SignUpService,
              private notificationsService: NotificationsService,
              private dialog: MatDialog,
              private route:Router,
              private forget:ForgetPasswordService
            ) { }
         

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email]],
    });
  }

  // Handle form submission
  onSubmit() {
    if (this.loginForm.valid) {
    const email = this.loginForm.get('email')?.value;
    this.forget.forgotPassword(email).subscribe({
      next: (res) => {
        if(res.success)
        {
          this.isLoading=true;
          this.notificationsService.toastrSuccess(res.message);
          this.loginForm.reset();
          this.isLoading = false;
        }
        else{
          this.isLoading = false;
          this.notificationsService.toastrWarning(res.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }
}
}

