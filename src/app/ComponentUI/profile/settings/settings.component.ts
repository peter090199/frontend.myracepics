import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChangePasswordComponent } from 'src/app/ComponentSharedUI/forgot-password-ui/ChangePassword/change-password.component';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  users: any = {
    fullname: '',
    profile_picture: 'assets/avatar.png',
    cover_photo: 'assets/default-cover.jpg', // default cover photo
    profession: '',
    email: '',
    company: '',
    industry: '',
    contact_no: '',
    current_location: '',
    home_country: '',
    date_birth: '',
    companywebsite: '',
    role_code: '',
    visibility: '',
    password_updated_at: '',
    activity: []
  };
  isLoading: boolean = true;
  currentUserCode: any;
  @ViewChild('coverInput') coverInput!: ElementRef<HTMLInputElement>;

  constructor(
    private user: AuthService,
    private alert: NotificationsService,
    public dialog: MatDialog, private authServiceCode: AuthService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getUserAccounts();
    this.currentUserCode = this.authServiceCode.getAuthCode();
  }

  /** Load user profile */
  async getUserAccounts() {
    this.isLoading = true;

    try {
      const res: any = await firstValueFrom(this.user.getProfilecode());
      this.users = {
        ...this.users,
        ...res.message
      };

      // Fallback for activity if empty
      if (!this.users.activity || this.users.activity.length === 0) {
        this.users.activity = [
          'Logged in on ' + new Date().toLocaleDateString(),
          'Updated profile information',
          'Changed password last week'
        ];
      }
    } catch (err) {
      console.error('Error loading user:', err);
      this.alert.toastrInfo('Error loading user');
    } finally {
      this.isLoading = false;
    }
  }

  /** Trigger file input click */
  triggerCoverUpload(): void {
    this.coverInput.nativeElement.click();
  }

  /** Handle selected cover photo */
  async onCoverSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    // Preview locally
    const reader = new FileReader();
    reader.onload = () => {
      this.users.cover_photo = reader.result as string;
    };
    reader.readAsDataURL(file);

    try {
      // Upload to backend
      // const formData = new FormData();
      // formData.append('cover_photo', file);

      // const res: any = await firstValueFrom(this.user.uploadCoverPhoto(formData));
      // if (res.success) {
      //   this.alert.toastrSuccess('Cover photo updated!');
      //   this.users.cover_photo = res.cover_photo; // updated URL from backend
      // } else {
      //   this.alert.toastrInfo('Failed to update cover photo');
      // }
    } catch (err) {
      console.error('Upload error:', err);
      this.alert.toastrInfo('Error uploading cover photo');
    }
  }

  /** Edit profile */
  editProfile(): void {
    this.alert.toastrInfo('Edit Profile coming soon!');
  }

  /** Change password */
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


  // In your component class
  onAvatarSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      // Preview immediately
      this.users.profile_picture = reader.result as string;

      // TODO: send file to backend for saving
      this.uploadAvatar(file);
    };
    reader.readAsDataURL(file);
  }

  uploadAvatar(file: File) {
    // Call your API to save avatar
    console.log('Uploading avatar:', file);
  }



}
