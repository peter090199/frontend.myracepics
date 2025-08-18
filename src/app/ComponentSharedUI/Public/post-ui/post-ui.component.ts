// import { Component, OnInit } from '@angular/core';
// import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
// import { ProfileService } from 'src/app/services/Profile/profile.service';
// import { PostUploadImageComponent } from '../post-upload-image/post-upload-image.component';
// import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';
// import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';  // Import HttpClient

// @Component({
//   selector: 'app-post-ui',
//   templateUrl: './post-ui.component.html',
//   styleUrls: ['./post-ui.component.css']
// })
// export class PostUIComponent implements OnInit {
//   postForm!: FormGroup;
//   profiles: any = [];
//   error: any;
//   selectedFiles: File[] = [];
//   uploadedImages: File[] = []; 

//   statusOptions = [
//     { label: 'Public', value: 1 },
//     { label: 'Private', value: 0 }
//   ];

//   constructor(
//     public dialogRef: MatDialogRef<PostUIComponent>,
//     private profile: ProfileService,
//     public dialog: MatDialog,
//     private imageUploadService: PostUploadImagesService,
//     private fb: FormBuilder,
//     private http: HttpClient  // Inject HttpClient
//   ) {}

//   ngOnInit(): void {
//     this.postForm = this.fb.group({
//       caption: new FormControl(''),
//       status: new FormControl(1),
//       post:this.uploadedImages
//     });

//     const url = window.location.href;

//     this.imageUploadService.images$.subscribe((formData: FormData | null) => {
//       if (formData) {
//         this.uploadedImages = [];
//         formData.forEach((file) => {
//           if (file instanceof File) {
//             this.uploadedImages.push(file);
//           }
//         });
//         console.log('Received images in Post UI:', this.uploadedImages);
//       }
//     });


//   }

//   postDataxxxx() {
//   if (this.postForm.valid && this.selectedFiles.length > 0) {
//     const formData = new FormData();

//     // Append files to FormData
//     this.selectedFiles.forEach((file: File) => {
//       formData.append('files[]', file, file.name);
//     });

//     // Append form data to FormData
//     formData.append('caption', this.postForm.value.caption);
//     formData.append('status', this.postForm.value.status.toString()); // Ensure it's a string
//     formData.append('posts', JSON.stringify(this.uploadedImages)); // Append posts (e.g., image URLs)

//     // Log formData
//     for (let pair of (formData as any).entries()) {  // Cast formData to any to allow entries() method
//       console.log(pair[0] + ": " + pair[1]); // Log key-value pairs
//     }
//     // Optionally, you can return here for testing
//     return;  // Prevent actual HTTP request for now
//   } else {
//     console.error('Form is invalid or no files selected');
//   }
// }

// postData() {
//   if (this.postForm.valid) {
//     const formData = new FormData();

//     // Append files to FormData
//     this.uploadedImages.forEach((file: File) => {
//       formData.append('files[]', file, file.name);
//     });

//     // Append form data (caption and status)
//     formData.append('caption', this.postForm.value.caption);
//     formData.append('status', this.postForm.value.status.toString()); // Ensure it's a string
//     // formData.append('posts', this.uploadedImages); // Append posts (e.g., image URLs)

//     for (let pair of (formData as any).entries()) {  // Cast formData to any to allow entries() method
//       console.log(pair[0] + ": " + pair[1]); // Log key-value pairs
//     }


//     // Now make the HTTP request (uncomment to enable)
//     // this.http.post('https://your-laravel-api.com/api/posts', formData).subscribe({
//     //   next: (response) => {
//     //     console.log('Post saved successfully:', response);
//     //     this.dialogRef.close(); // Close dialog on success
//     //   },
//     //   error: (error) => {
//     //     console.error('Error saving post:', error); // Handle errors
//     //   }
//     // });
//   } else {
//     console.error('Form is invalid or no files selected');
//   }
// }


//   postDataxxx() {
//     if (this.postForm.valid) { // Make sure selectedFiles is not empty
//       const formData = new FormData();

//       // // Append files to FormData
//       // this.selectedFiles.forEach((file: File) => {
//       //   formData.append('files[]', file, file.name); // Ensure you append the file and its name
//       // });

//       formData.append('caption', this.postForm.value.caption);
//       formData.append('status', this.postForm.value.status.toString()); // Ensure it's a string
//       formData.append('posts', JSON.stringify(this.uploadedImages)); 
//       console.log(formData)


//       return;

//       // Send POST request to the Laravel backend
//       this.http.post('https://your-laravel-api.com/api/posts', formData).subscribe({
//         next: (response) => {
//           console.log('Post saved successfully:', response);
//           this.dialogRef.close();
//         },
//         error: (error) => {
//           console.error('Error saving post:', error);
//         }
//       });
//     } else {
//       console.error('Form is invalid or no files selected');
//     }
//   }


//   postDataxx() {
//     if (!this.postForm.valid) return;

//     const formData = new FormData();
//     this.uploadedImages.forEach((file) => {
//       formData.append('files[]', file);
//     });

//     formData.append('caption', this.postForm.value.caption);
//     formData.append('status', this.postForm.value.status);


//     // Send FormData to Laravel
//     this.http.post('http://your-laravel-api.com/api/posts', formData).subscribe({
//       next: (response) => {
//         console.log('Post successful:', response);
//         this.dialogRef.close(response); // Close dialog and return response
//       },
//       error: (error) => {
//         console.error('Error posting:', error);
//         this.error = error.message || 'Failed to post data';
//       }
//     });
//   }

//   closeDialog() {
//     this.dialogRef.close();
//   }

//   // loadProfileCV(){
//   //       this.profile.getProfileByUser(this.code).subscribe({
//   //         next: (response) => {
//   //           if (response.success == true) {
//   //             this.profiles = response.message; 

//   //           } else {
//   //             this.error = 'Failed to load profile data';
//   //           }
//   //         },
//   //         error: (err) => {
//   //           this.error = err.message || 'An error occurred while fetching profile data';
//   //         },
//   //       });
//   //     }

//   uploadImage() {
//     const dialogConfig = new MatDialogConfig();
//     dialogConfig.disableClose = true;
//     dialogConfig.autoFocus = true;
//     const dialogRef = this.dialog.open(PostUploadImageComponent, dialogConfig);

//     dialogRef.afterClosed().subscribe((images: File[] | undefined) => {
//       if (images) {
//         this.uploadedImages = images;
//         console.log('Received images from dialog:', images);
//       }
//     });
//   }

//   uploadVideo() {
//     console.log('Video upload clicked');
//   }
// }


import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { ProfileService } from 'src/app/services/Profile/profile.service';
import { PostUploadImageComponent } from '../post-upload-image/post-upload-image.component';
import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { NotificationsService } from 'src/app/services/Global/notifications.service';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';




@Component({
  selector: 'app-post-ui',
  templateUrl: './post-ui.component.html',
  styleUrls: ['./post-ui.component.css']
})
export class PostUIComponent implements OnInit {
  postForm!: FormGroup;
  profiles: any;
  error: any;
  selectedFiles: File[] = [];
  uploadedImages: File[] = [];  // This will hold the selected images

  profiles2: any = []
  statusOptions = [
    { label: 'Public', value: 1 },
    { label: 'Private', value: 0 }
  ];

  constructor(
    public dialogRef: MatDialogRef<PostUIComponent>,
    private profile: ProfileService,
    public dialog: MatDialog,
    private imageUploadService: PostUploadImagesService,
    private fb: FormBuilder,
    private http: HttpClient,
    private alert: NotificationsService,
    private authService: ProfileService, private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUser();
    this.postForm = this.fb.group({
      caption: ['', Validators.required],
      status: ['', Validators.required] // Corrected here
    });


    // Subscribe to the image upload service to update uploaded images
    this.imageUploadService.images$.subscribe((formData: FormData | null) => {
      if (formData) {
        this.uploadedImages = []; // Clear existing images
        formData.forEach((file) => {
          if (file instanceof File) {
            this.uploadedImages.push(file);  // Add valid file to uploadedImages
          }
        });
        console.log('Received images in Post UI:', this.uploadedImages);
      }
    });
  }

  getProfileImage(url: string): string {
    if (!url) {
      return 'assets/default-profile.png';
    }

    // If string contains https, extract it
    const match = url.match(/https?:\/\/[^\s]+/);
    return match ? match[0] : url;
  }


  getSelectedStatus() {
    return this.statusOptions.find(option => option.value === this.postForm.get('status')?.value)?.label;
  }

  loadUserProfile(): void {
    this.authService.getProfileByUserOnly().subscribe({
      next: (res) => {
        if (res.success == true) {
          this.profiles2 = res.message;
        } else {
          console.error('⚠️ Failed to load user profile:', res.message);
        }
      },
      error: (err) => {
        console.error('❌ Error fetching user data:', err);
      },
    });
  }

  loadUser() {
    this.authService.getProfileByBasicInfo().subscribe({
      next: (res) => {
        this.profiles = res.data;

      },
      error: (err) => {
        console.error('❌ Error fetching user data:', err);
      },
    });
  }

  isUploading: boolean = false;
  uploadProgress: number = 0;
  postData() {
    if (this.postForm.valid) {
      this.isUploading = true; // show progress bar

      const formData = new FormData();
      formData.append('caption', this.postForm.value.caption);
      formData.append('status', this.postForm.value.status.toString());

      for (let file of this.uploadedImages) {
        formData.append('posts[]', file);
      }

      if (this.selectedVideoFile) {
        formData.append('video', this.selectedVideoFile);
      }

      this.imageUploadService.uploadImages(formData).subscribe({
        next: (res) => {
          this.isUploading = false; // hide progress bar
          if (res.success == true) {
            this.alert.toastrSuccess(res.message);
            this.resetForm();
          }
        },
        error: (error) => {
          this.isUploading = false; // hide progress bar
          console.error('Upload failed:', error);
          this.alert.toastrWarning(error.error?.message || "Upload failed. Please try again.");
        }
      });
    }
  }

  postDataxx() {
    if (this.postForm.valid) {
      this.isUploading = true;
      this.uploadProgress = 0;

      const formData = new FormData();
      formData.append('caption', this.postForm.value.caption);
      formData.append('status', this.postForm.value.status.toString());

      for (let file of this.uploadedImages) {
        formData.append('posts[]', file);
      }

      // Append video (if any)
      if (this.selectedVideoFile) {
        formData.append('video', this.selectedVideoFile);
      }

      this.imageUploadService.uploadImages(formData).subscribe({
        next: (res) => {
          if (res.success == true) {
            this.isUploading = false;
            this.alert.toastrSuccess(res.message);
            this.resetForm();
          }

        },
        error: (error) => {
          console.error('Upload failed:', error);
          this.alert.toastrWarning(error.error?.message || "Upload failed. Please try again.");
          //this.isUploading = false;
        }
      });

    }
  }

  resetForm() {
    this.uploadedImages = [];
    this.postForm.reset();
    this.imageUploadService.clearImages();
    this.selectedVideoFile = null;
    this.videoPreviewUrl = null;
  }

  // Upload image function
  uploadImage() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '700px';
    const dialogRef = this.dialog.open(PostUploadImageComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      // this.closeDialog()
    });


    // After image upload dialog closes, update the uploaded images
    // dialogRef.afterClosed().subscribe((images: File[] | undefined) => {
    //   if (images) {
    //     this.uploadedImages = images;  // Update uploaded images
    //     console.log('Received images from dialog:', images);
    //   }
    // });
  }


  selectedVideoFile: File | null = null;
  videoPreviewUrl: SafeUrl | null = null;
  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0] ? input.files[0] : null;

    if (!file) {
      this.selectedVideoFile = null;
      this.videoPreviewUrl = null; // will show static sample
      return;
    }

    // optional basic validations
    const maxSizeMB = 50;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Video too large. Max ${maxSizeMB}MB.`);
      input.value = '';
      return;
    }
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file.');
      input.value = '';
      return;
    }

    this.selectedVideoFile = file;
    const blobUrl = URL.createObjectURL(file);
    this.videoPreviewUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
  }


  isPlaying = false;
  videoPaused = true;
  currentTime = 0;

  toggleVideo(video: HTMLVideoElement) {
    if (video.paused) {
      video.play();
      this.isPlaying = true;
      this.videoPaused = false;
    } else {
      video.pause();
      this.isPlaying = false;
      this.videoPaused = true;
    }
  }

  progressValue = 0;
  updateProgress(video: HTMLVideoElement) {
    this.currentTime = video.currentTime;
    if (video.duration > 0) {
      this.progressValue = (video.currentTime / video.duration) * 100;
    }
  }

  seekVideo(video: HTMLVideoElement, event: any) {
    video.currentTime = event.target.value;
  }

  formatTime(seconds: number): string {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  onPause() {
    this.isPlaying = false;
    this.videoPaused = true;
  }

  toggleFullscreen(video: HTMLVideoElement) {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if ((video as any).webkitEnterFullscreen) {
      (video as any).webkitEnterFullscreen(); // Safari
    }
  }

  onPlay() {
    this.isPlaying = true;
  }

  closeDialog() {
    this.dialogRef.close();  // Close the dialog

  }
}
