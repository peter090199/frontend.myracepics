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
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { NotificationsService } from 'src/app/services/Global/notifications.service';




@Component({
  selector: 'app-post-ui',
  templateUrl: './post-ui.component.html',
  styleUrls: ['./post-ui.component.css']
})
export class PostUIComponent implements OnInit {
  postForm!: FormGroup;
  profiles: any = [];
  error: any;
  selectedFiles: File[] = [];
  uploadedImages: File[] = [];  // This will hold the selected images

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
    private alert:NotificationsService
  ) {}

  ngOnInit(): void {
    // Initialize form group with caption and status
    this.postForm = this.fb.group({
      caption: new FormControl(''),
      status: new FormControl(1),  // Default status as 'Public'
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

  // Post data function
  postData() {
    if (this.postForm.valid) {
      const formData = new FormData();
 

      // Append uploaded files to FormData
      // this.uploadedImages.forEach((file: File) => {
      //   formData.append('files[]', file, file.name); // Append file with its name
      // });

      formData.append('caption', this.postForm.value.caption);
      formData.append('status', this.postForm.value.status.toString()); // Ensure it's a string
      this.uploadedImages.forEach((file) => {
        formData.append('posts', file);
      });
      
      this.imageUploadService.uploadImages(formData).subscribe({
        next: (res) => {
          if(res.success == true) 
          {
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
  }

  // Upload image function
  uploadImage() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
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

  closeDialog() {
    this.dialogRef.close();  // Close the dialog
  }
}
