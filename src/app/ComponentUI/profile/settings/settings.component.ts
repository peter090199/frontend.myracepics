import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChangePasswordComponent } from 'src/app/ComponentSharedUI/forgot-password-ui/ChangePassword/change-password.component';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
// import { EditProfileComponent } from '../edit-profile/edit-profile.component'; // optional if you want profile edit modal

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  users: any = {};   // ✅ should be object, not array
  isLoading: boolean = false;

  constructor(
    private user: AuthService,
    private alert: NotificationsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUserAccounts();
  }

  /** ✅ Load user profile from backend */
  getUserAccounts() {
    this.isLoading = true;
    this.user.getProfilecode().subscribe({
      next: (res) => {
        this.users = res.message;

        // Mock activity if not provided by backend
        if (!this.users.activity) {
          this.users.activity = [
            'Logged in on ' + new Date().toLocaleDateString(),
            'Updated profile information',
            'Changed password last week'
          ];
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user:', err);
        this.isLoading = false;
        this.alert.toastrInfo('Error loading user');
      }
    });
  }

  /** ✅ Edit profile handler */
  editProfile(): void {
    // If you want a modal form:
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = '600px';
    // const dialogRef = this.dialog.open(EditProfileComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.getUserAccounts();
    //   }
    // });

    this.alert.toastrInfo('Edit Profile coming soon!');
  }

  /** ✅ Open change password modal */
  Changepassword(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';

    const dialogRef = this.dialog.open(ChangePasswordComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUserAccounts();
      }
    });
  }
}
