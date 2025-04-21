import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent implements OnInit {
  isLoading: boolean = false;
  usercode: any;
  posts: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ImageModalComponent>,
    private alert: NotificationsService,
    private postDataservices: PostUploadImagesService,
    private authService: AuthService
  ) {
    this.posts = Array.isArray(data) ? data : [data];
    console.log("Incoming posts:", this.posts);
  }

  ngOnInit(): void {
    this.getCode(); // Only needed for delete or re-fetch
    this.loadUserPost();
  }

  getCode(): void {
    this.authService.getProfilecode().subscribe({
      next: (res) => {
        if (res.success && res.message.length > 0) {
          this.usercode = res.message[0].code;
        }
      },
      error: (err) => {
        console.error("Error fetching profile:", err);
      }
    });
  }

  loadUserPost(): void {
    if (!this.usercode) return;

    this.isLoading = true;
    this.postDataservices.getDataPostAddFollow(this.usercode).subscribe(
      (data) => {
        if (data && Array.isArray(data)) {
          this.posts = data.map(post => ({
            ...post,
            path_url: post.path_url
          }));
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }

  deleteImage(imageId: any): void {
    this.alert.popupWarning("", "Are you sure you want to delete this image?").then((result: any) => {
      if (result?.value) {
        this.isLoading = true;
        this.postDataservices.deletePosts_uuind(imageId).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.alert.toastrSuccess(res.message);
            //  this.close();
             // this.loadUserPost(); // reload if deleted
            } else {
              this.alert.toastrError(res.message);
            }
            this.isLoading = false;
          },
          error: (error: any) => {
            this.alert.toastrError(error.error?.message || "An error occurred while deleting the post.");
            this.isLoading = false;
          }
        });
      }
    });
  }

  addComment(post: any): void {
    if (post.newComment?.trim()) {
      // Add the new comment
      const newEntry = {
        username: "You", // Replace this with the actual logged-in user name
        text: post.newComment
      };
      post.comments = post.comments || [];
      post.comments.push(newEntry);

      // Reset the newComment field
      post.newComment = '';
    }
  }

  

}


// import { Component, Inject, OnInit } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { AuthService } from 'src/app/services/auth.service';
// import { NotificationsService } from 'src/app/services/Global/notifications.service';
// import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';

// @Component({
//   selector: 'app-image-modal',
//   templateUrl: './image-modal.component.html',
//   styleUrls: ['./image-modal.component.css']
// })
// export class ImageModalComponent implements OnInit {
//   image:any=[];
//   isLoading:boolean = false;
//   usercode:any;
//   posts:any = [];

//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data:any,
//     private dialogRef: MatDialogRef<ImageModalComponent>,
//     private alert:NotificationsService,
//     private postDataservices:PostUploadImagesService,
//     private authService: AuthService
//   ) {

//     this.posts = data;
//     this.posts = Array.isArray(data) ? data : [];
//     console.log("Incoming posts:", this.posts);
//   }
//   ngOnInit(): void {
//     this.loadUserPost();
//     this.getCode();
//   }

  
//   getCode(): void {
//     this.authService.getProfilecode().subscribe({
//       next: (res) => {
//         if (res.success && res.message.length > 0) {
//           this.usercode = res.message[0].code;
//           this.loadUserPost();
//         }
//       },
//       error: (err) => {
//         console.error("Error fetching profile:", err);
//       }
//     });
//   }

//   loadUserPost(): void {
    
//     this.isLoading = true;

//     this.postDataservices.getDataPostAddFollow(this.usercode).subscribe(
//       (data) => {
//         if (data && Array.isArray(data)) {
//           this.posts = data.map(post => ({
//             ...post,
//             images: post.images || [] // ensure it has images
          
//           }));
//         }
//         this.isLoading = false;
//       },
//       (error) => {
//         console.error('Error fetching posts:', error);
//         this.isLoading = false;
//       }
//     );
//   }

//   close(): void {
//     this.dialogRef.close();
//   }


//   deleteImage(image: any): void {
//     console.log(image)
//     this.alert.popupWarning("","Are you sure you want to delete this image?").then((result: any) => {
//       if (result?.value) {
//         this.isLoading = true;

//         console.log(image);
//         this.postDataservices.deletePosts_uuind(image).subscribe({
//           next: (res: any) => {
//             if (res.success === true) {
//               this.alert.toastrSuccess(res.message);
//               this.loadUserPost();
//             } else {
//               this.alert.toastrError(res.message);
//             }
           
//             this.isLoading = false;
//           },
//           error: (error: any) => {
//             this.alert.toastrError(error.error?.message || "An error occurred while deleting the post.");
//             this.isLoading = false;
//           }
//         });
//       }
//     });
   
//   }


// }
