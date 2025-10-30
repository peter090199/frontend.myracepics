// import { Component, OnInit } from '@angular/core';
// import { MatDialogRef } from '@angular/material/dialog';
// import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';

// @Component({
//   selector: 'app-post-upload-image',
//   templateUrl: './post-upload-image.component.html',
//   styleUrls: ['./post-upload-image.component.css']
// })
// export class PostUploadImageComponent implements OnInit {
//   showUploadForm = true; 
//   currentIndex = 0;
//   slides: { posts: string; thumbnail: string; caption: string }[] = [];
//   uploadedImages: File[] = [];

//   constructor(private dialogRef: MatDialogRef<PostUploadImageComponent>,
//               private imageUploadService:PostUploadImagesService

//   ) { }

//   ngOnInit(): void {
//     this.imageUploadService.getImages(){
//       this.slides = uploadedImages;
//     };
//   }

//   changeSlide(n: number) {
//     this.currentIndex = (this.currentIndex + n + this.slides.length) % this.slides.length;
//   }

//   setSlide(index: number) {
//     this.currentIndex = index;
//   }

//   onImagesUpload(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (input.files) {
//       const newImages: { posts: string; thumbnail: string; caption: string }[] = [];
//       Array.from(input.files).forEach(file => {
//         const reader = new FileReader();
//         reader.onload = (e: any) => {
//           const image = { posts: e.target.result, thumbnail: e.target.result, caption: 'Uploaded Image' };
//           newImages.push(image);
//         };
//         reader.readAsDataURL(file);
//       });

//       setTimeout(() => {
//         this.imageUploadService.addImages(newImages);
//       }, 500);
//     }
//   }


//   onImagesUploadxx(event: any) {
//     const files: FileList = event.target.files;
//     if (files.length === 0) return;

//     Array.from(files).forEach((file) => {
//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         const imageSrc = e.target.result;
//         this.uploadedImages.push(imageSrc);
//         this.slides.push({
//           posts: imageSrc,
//           thumbnail: imageSrc,
//           caption: 'Uploaded Image'
//         });
//         this.currentIndex = this.slides.length - 1; // Show the latest uploaded image
//       };
//       reader.readAsDataURL(file);
//       this.uploadedImages.push(file);
//     });
//   }



//   clearUploads() {
//     this.slides =[];
//     this.uploadedImages = [];
//     this.currentIndex = 0; // Reset to the first slide
//   }

//   closeDialog() {
//     this.dialogRef.close();
//     this.clearUploads();
//   }

//   sendPostImage() {
//     const formData = new FormData();
//     this.uploadedImages.forEach((file) => {
//       formData.append('posts', file);
//     });

//     this.imageUploadService.setImages(formData);
//     this.dialogRef.close();
//     // this.dialogRef.close(formData);
//   }

// }

import { Component, Inject, OnInit } from '@angular/core';
import { inject } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';

@Component({
  selector: 'app-post-upload-image',
  templateUrl: './post-upload-image.component.html',
  styleUrls: ['./post-upload-image.component.css']
})
export class PostUploadImageComponent implements OnInit {
  showUploadForm = true;
  currentIndex = 0;
  slides: { posts: string; thumbnail: string; caption: string }[] = [];
  uploadedImages: File[] = [];

  constructor(
    private dialogRef: MatDialogRef<PostUploadImageComponent>,
    private imageUploadService: PostUploadImagesService, @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    // Load images from dialog data if provided
    // If data.images exists, map it to slides
    if (this.data?.images && this.data.images.length > 0) {
      this.slides = this.data.images.map((img: { path_url: any; path: any; posts: any; }) => ({
        posts: img.path_url || img.path || img.posts, // pick the correct field
        thumbnail: img.path_url || img.path || img.posts,
        caption: this.data.caption || 'Uploaded Image'
      }));
    }
    // Load any preview images from service
    const previewImages = this.imageUploadService.getPreviewImages();
    if (previewImages.length > 0) {
      this.slides = [...this.slides, ...previewImages];
    }
    // this.slides = this.imageUploadService.getPreviewImages(); // No need for Observable if it's an array
  }

  changeSlide(n: number) {
    this.currentIndex = (this.currentIndex + n + this.slides.length) % this.slides.length;
  }

  setSlide(index: number) {
    this.currentIndex = index;
  }

  onImagesUploadxx(event: any) {
    const files: FileList = event.target.files;
    if (files.length === 0) return;
    const newImages: { posts: string; thumbnail: string; caption: string }[] = [];

    Array.from(files).forEach((file) => {

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageSrc = e.target.result;
        this.uploadedImages.push(imageSrc);
        this.slides.push({
          posts: imageSrc,
          thumbnail: imageSrc,
          caption: 'Uploaded Image'
        });
        newImages.push(imageSrc);
        this.currentIndex = this.slides.length - 1; // Show the latest uploaded image
      };
      reader.readAsDataURL(file);
      this.uploadedImages.push(file);
    });

    setTimeout(() => {
      this.imageUploadService.addImages(newImages);
      this.slides = this.imageUploadService.getPreviewImages();
    }, 500);
  }



  onImagesUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newImages: { posts: string; thumbnail: string; caption: string }[] = [];
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const image = { posts: e.target.result, thumbnail: e.target.result, caption: 'Uploaded Image' };
          newImages.push(image);
        };
        reader.readAsDataURL(file);
        this.uploadedImages.push(file);
      });

      setTimeout(() => {
        this.imageUploadService.addImages(newImages);
        this.slides = this.imageUploadService.getPreviewImages();
      }, 500);
    }
  }

  clearUploads() {
    this.imageUploadService.clearImages();
    this.slides = [];
    this.uploadedImages = [];
    this.currentIndex = 0;
  }
  removeImage(index: number) {
    this.slides.splice(index, 1); // Remove image from array
  }

  closeDialog() {
    this.dialogRef.close();
    // Do not reset slides to persist data after closing
  }

  sendPostImage() {
    const formData = new FormData();
    this.uploadedImages.forEach((file) => {
      formData.append('posts', file);
    });

    this.imageUploadService.setImages(formData);
    this.dialogRef.close();
  }
}
