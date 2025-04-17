import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent {
  image:any=[];
  isLoading:boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dialogRef: MatDialogRef<ImageModalComponent>,
    private alert:NotificationsService,
    private postDataservices:PostUploadImagesService
  ) {

    this.image = data;
 //   console.log(this.imageUrl)
  }

  close(): void {
    this.dialogRef.close();
  }


  deleteImage(image: any): void {
    this.alert.popupWarning("","Are you sure you want to delete this post?").then((result: any) => {
      if (result?.value) {
        this.isLoading = true;

        console.log(image);
        this.postDataservices.deletePosts_uuind(image).subscribe({
          next: (res: any) => {
            if (res.success === true) {
              this.alert.toastrSuccess(res.message);
            } else {
              this.alert.toastrError(res.message);
            }

            this.close();
           // this.loadUserPost();
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


}
