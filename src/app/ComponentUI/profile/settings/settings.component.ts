import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';
import { ProfileService } from 'src/app/services/Profile/profile.service';

import { ChangePasswordComponent } from 'src/app/ComponentSharedUI/forgot-password-ui/ChangePassword/change-password.component';
import { UploadProfileComponent } from 'src/app/ComponentSharedUI/Individual/upload-profile/upload-profile.component';
import { SharedService } from 'src/app/services/SharedServices/shared.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  users: any = {}; // User object
  profile_pic: any = null;

  isLoading = false;
  currentUserCode: string | null = null;

  profileForm!: FormGroup;
  imageForm!: FormGroup;
  @ViewChild('coverInput') coverInput!: ElementRef<HTMLInputElement>;

  // Previews

  logoPreview: string | ArrayBuffer | null = null;
  profilePreview: string | ArrayBuffer | null = null;

  // Selected files
  selectedLogo: File | null = null;
  selectedProfile: File | null = null;

  constructor(
    private authService: AuthService,
    private alert: NotificationsService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private cvService: CurriculumVitaeService,
    private profileService: ProfileService,
    private http: HttpClient,
    public sharedServices: SharedService
  ) { }

  async ngOnInit(): Promise<void> {
    this.currentUserCode = this.authService.getAuthCode();
    await this.getProfile();
    this.initProfileForm();

  }

  // =========================
  // PROFILE FORM
  // =========================
  initProfileForm(): void {
    this.profileForm = this.fb.group({
      fname: [''],
      mname: [''],
      lname: [''],
      current_location: [''],
      contact_no: [''],
      email: [{ value: '', disabled: true }],
      date_birth: [''],
      gender: [''],
      textwatermak: [''],
      logo: null,
      profile_picture: null
    });

    this.imageForm = this.fb.group({
      logo: null,
      profile_picture: null
    });

    this.imageForm.patchValue(this.users);
    this.profileForm.patchValue(this.users);
  }

  profileFields = [
    { key: 'fname', label: 'First Name', icon: 'person', type: 'text' },
    { key: 'mname', label: 'Middle Name', icon: 'person', type: 'text' },
    { key: 'lname', label: 'Last Name', icon: 'person', type: 'text' },
    { key: 'contact_no', label: 'Contact Number', icon: 'phone', type: 'text' },
    { key: 'email', label: 'Email', icon: 'email', type: 'text', readonly: true },
    { key: 'current_location', label: 'Current Location', icon: 'location_on', type: 'text' },
    { key: 'date_birth', label: 'Date of Birth', icon: 'calendar_today', type: 'date' },
    { key: 'gender', label: 'Gender', icon: 'wc', type: 'select' },
    { key: 'textwatermak', label: 'Photographer Name', icon: 'branding_watermark', type: 'text' },
  ];

  // =========================
  // FILE CHANGE / PREVIEW
  // =========================
  onFileChange(event: any, type: 'logo' | 'profile_picture') {
    const file = event.target.files?.[0] ?? null; // if no file selected, use null

    if (!file) {
      // If no file, clear preview and selected
      if (type === 'logo') {
        this.selectedLogo = null;
        this.logoPreview = null;
      } else if (type === 'profile_picture') {
        this.selectedProfile = null;
        this.profilePreview = null;
      }
      // Optionally, call API to send null if needed
      this.autoSaveImages(null, type);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'logo') {
        this.selectedLogo = file;
        this.logoPreview = reader.result; // base64 preview
      } else if (type === 'profile_picture') {
        this.selectedProfile = file;
        this.profilePreview = reader.result;
      }

      // Automatically save image after selection
      this.autoSaveImages(file, type);
    };
    reader.readAsDataURL(file);
  }

autoSaveImages(file: File | null, type: 'logo' | 'profile_picture') {
  this.isLoading = true;

  // Prepare payload
  const payload: any = {};

  // Helper to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Array of promises
  const promises: Promise<void>[] = [];

  // Handle logo
  if (type === 'logo') {
    if (file) {
      // Convert new file to base64
      promises.push(
        fileToBase64(file).then(base64 => {
          payload.logo = base64;
        })
      );
    } else {
      // No file → set null
      payload.logo = null;
    }
  }

  // Handle profile_picture
  if (type === 'profile_picture') {
    if (file) {
      promises.push(
        fileToBase64(file).then(base64 => {
          payload.profile_picture = base64;
        })
      );
    } else {
      payload.profile_picture = null;
    }
  }

  // When all promises finish, call API
  Promise.all(promises).then(() => {
    this.profileService.autoSaveImages(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res.success == true) {
            this.alert.toastrSuccess(res.message);
            this.getProfile();
        }
        else
        {
           this.alert.toastrError(res.message);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.alert.toastrError("Upload failed");
      }
    });
  }).catch(err => {
    this.isLoading = false;
    console.error('Failed to convert image to base64', err);
  });
}

  // =========================
  // GET PROFILE
  // =========================
  async getProfile(): Promise<void> {
    this.isLoading = true;
    try {
      const res: any = await firstValueFrom(this.profileService.getProfile());
      if (res.success == true) {
        this.users = res.data;
        if (this.profileForm) {
          this.profileForm.patchValue(this.users);
        }
        this.logoPreview = this.sharedServices.getImageUrl(this.users.logo);
        this.profilePreview = this.sharedServices.getImageUrl(this.users.profile_picture);

      } else {
        this.alert.toastrError(res.message || 'Failed to load profile');
      }
    } catch (err) {
      console.error('Error loading profile', err);
      this.alert.toastrError('Failed to load profile');
    } finally {
      this.isLoading = false;
    }
  }

  // =========================
  // PROFILE PICTURE
  // =========================
  uploadPic(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.disableClose = true;
    this.dialog.open(UploadProfileComponent, dialogConfig);
  }

  // =========================
  // PASSWORD
  // =========================
  changePassword(): void {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.getProfile();
    });
  }

  // =========================
  // SAVE PROFILE
  // =========================
  saveProfile(): void {
    if (this.profileForm.invalid) return;
    const payload = this.profileForm.getRawValue();
    const promises: Promise<void>[] = [];
    // After all base64 conversions, call API
    Promise.all(promises)
      .then(() => {
        this.profileService.updateProfile(payload).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.alert.toastrSuccess(res.message);
              this.getProfile();
            } else {
              this.alert.toastrError(res.message || 'Failed to save profile');
            }
          },
          error: (err) => {
            console.error('Profile save error:', err);
            this.alert.toastrError(err?.error?.message || 'Failed to save profile');
          }
        });
      })
      .catch(err => {
        console.error('Base64 conversion failed:', err);
        this.alert.toastrError('Failed to convert images');
      });
  }


  saveProfilexx(): void {
    if (this.profileForm.invalid) return;

    const payload = this.profileForm.getRawValue();

    // Convert selected files to base64 if user chose new logo/profile picture
    const fileToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    };

    const promises: Promise<void>[] = [];

    if (this.selectedLogo) {
      promises.push(
        fileToBase64(this.selectedLogo).then(base64 => {
          payload.logo = base64;
        })
      );
    }

    if (this.selectedProfile) {
      promises.push(
        fileToBase64(this.selectedProfile).then(base64 => {
          payload.profile_picture = base64;
        })
      );
    }

    // After all base64 conversions are done, call the API
    Promise.all(promises)
      .then(() => {
        console.log('Final payload to send:', payload);

        this.profileService.updateProfile(payload).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.alert.toastrSuccess(res.message);
              this.getProfile();
            } else {
              this.alert.toastrError(res.message || 'Failed to save profile');
            }
          },
          error: (err) => {
            console.error('Profile save error:', err);
            this.alert.toastrError(err?.error?.message || 'Failed to save profile');
          }
        });
      })
      .catch(err => {
        console.error('Base64 conversion failed:', err);
        this.alert.toastrError('Failed to convert images');
      });
  }



}
