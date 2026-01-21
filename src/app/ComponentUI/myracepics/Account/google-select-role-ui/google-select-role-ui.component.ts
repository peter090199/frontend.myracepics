import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoogleAuthService } from 'src/app/services/google/google-auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PhotographeruiComponent } from '../../createaccount/role/photographerui/photographerui.component';
import { RunneruiComponent } from '../../createaccount/role/runnerui/runnerui.component';

@Component({
  selector: 'app-google-select-role-ui',
  templateUrl: './google-select-role-ui.component.html',
  styleUrls: ['./google-select-role-ui.component.css']
})
export class GoogleSelectRoleUIComponent implements OnInit {

  roleForm!: FormGroup;
  userId!: any;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private authService: GoogleAuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParamMap.get('user_id');

    if (!this.userId) {
      this.router.navigate(['/createaccount']);
      return;
    }

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
    this.errorMessage = '';

    this.authService
      .setRole(this.userId, this.roleForm.value.role)
      .subscribe({
        next: (res) => {
          this.loading = false;

          if (!res?.success) {
            this.errorMessage = 'Failed to set role.';
            return;
          }

          // 🔐 STORE SESSION
          sessionStorage.setItem('token', res.token);
          sessionStorage.setItem('role', res.role);
          sessionStorage.setItem('user_id', String(res.user_id));
          sessionStorage.setItem('is_online', 'true');

          // 🚦 ROLE-BASED REDIRECT
          switch (res.role) {
            case 'photographer':
              this.router.navigate(['/photographer/allevents']);
              break;

            case 'runner':
              this.router.navigate(['/runner/allevents']);
              break;

            default:
              this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage =
            err.error?.message || 'Failed to set role.';
        }
      });
  }

  onRoleSelected(role: string): void {
    this.roleForm.patchValue({ role });

    if (role === 'runner') {
      this.dialog.open(RunneruiComponent, {
        width: '500px'
      });
    }

    if (role === 'photographer') {
      this.dialog.open(PhotographeruiComponent, {
        width: '500px'
      });
    }
  }
}
