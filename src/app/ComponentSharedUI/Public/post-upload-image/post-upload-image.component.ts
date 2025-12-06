// // import { Component, OnInit } from '@angular/core';
// // import { MatDialogRef } from '@angular/material/dialog';
// // import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';

// // @Component({
// //   selector: 'app-post-upload-image',
// //   templateUrl: './post-upload-image.component.html',
// //   styleUrls: ['./post-upload-image.component.css']
// // })
// // export class PostUploadImageComponent implements OnInit {
// //   showUploadForm = true; 
// //   currentIndex = 0;
// //   slides: { posts: string; thumbnail: string; caption: string }[] = [];
// //   uploadedImages: File[] = [];

// //   constructor(private dialogRef: MatDialogRef<PostUploadImageComponent>,
// //               private imageUploadService:PostUploadImagesService

// //   ) { }

// //   ngOnInit(): void {
// //     this.imageUploadService.getImages(){
// //       this.slides = uploadedImages;
// //     };
// //   }

// //   changeSlide(n: number) {
// //     this.currentIndex = (this.currentIndex + n + this.slides.length) % this.slides.length;
// //   }

// //   setSlide(index: number) {
// //     this.currentIndex = index;
// //   }

// //   onImagesUpload(event: Event) {
// //     const input = event.target as HTMLInputElement;
// //     if (input.files) {
// //       const newImages: { posts: string; thumbnail: string; caption: string }[] = [];
// //       Array.from(input.files).forEach(file => {
// //         const reader = new FileReader();
// //         reader.onload = (e: any) => {
// //           const image = { posts: e.target.result, thumbnail: e.target.result, caption: 'Uploaded Image' };
// //           newImages.push(image);
// //         };
// //         reader.readAsDataURL(file);
// //       });

// //       setTimeout(() => {
// //         this.imageUploadService.addImages(newImages);
// //       }, 500);
// //     }
// //   }


// //   onImagesUploadxx(event: any) {
// //     const files: FileList = event.target.files;
// //     if (files.length === 0) return;

// //     Array.from(files).forEach((file) => {
// //       const reader = new FileReader();
// //       reader.onload = (e: any) => {
// //         const imageSrc = e.target.result;
// //         this.uploadedImages.push(imageSrc);
// //         this.slides.push({
// //           posts: imageSrc,
// //           thumbnail: imageSrc,
// //           caption: 'Uploaded Image'
// //         });
// //         this.currentIndex = this.slides.length - 1; // Show the latest uploaded image
// //       };
// //       reader.readAsDataURL(file);
// //       this.uploadedImages.push(file);
// //     });
// //   }



// //   clearUploads() {
// //     this.slides =[];
// //     this.uploadedImages = [];
// //     this.currentIndex = 0; // Reset to the first slide
// //   }

// //   closeDialog() {
// //     this.dialogRef.close();
// //     this.clearUploads();
// //   }

// //   sendPostImage() {
// //     const formData = new FormData();
// //     this.uploadedImages.forEach((file) => {
// //       formData.append('posts', file);
// //     });

// //     this.imageUploadService.setImages(formData);
// //     this.dialogRef.close();
// //     // this.dialogRef.close(formData);
// //   }

// // }

// import { Component, Inject, OnInit } from '@angular/core';
// import { inject } from '@angular/core/testing';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { NsfwDetectorService } from 'src/app/services/DetectorAI/nsfw-detector.service';
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
//   imageUrl: string = '';
//   result: any;

//   constructor(
//     private dialogRef: MatDialogRef<PostUploadImageComponent>,
//     private imageUploadService: PostUploadImagesService, @Inject(MAT_DIALOG_DATA) public data: any,
//      private nsfwService: NsfwDetectorService
//   ) { }


//     checkImage() {
//     if (!this.imageUrl) return;

//     this.nsfwService.detectNSFW(this.imageUrl).subscribe(
//       res => {
//         this.result = res;
//         console.log('NSFW Result:', res);
//       },
//       err => console.error(err)
//     );
//   }


//   ngOnInit(): void {
//     console.log(this.data)
//     // Load images from dialog data if provided
//     // If data.images exists, map it to slides
//     if (this.data?.images && this.data.images.length > 0) {
//       this.slides = this.data.images.map((img: { path_url: any; path: any; posts: any; }) => ({
//         posts: img.path_url || img.path || img.posts, // pick the correct field
//         thumbnail: img.path_url || img.path || img.posts,
//         caption: this.data.caption || 'Uploaded Image'
//       }));
//     }
//     // Load any preview images from service
//     const previewImages = this.imageUploadService.getPreviewImages();
//     if (previewImages.length > 0) {
//       this.slides = [...this.slides, ...previewImages];
//     }
//     // this.slides = this.imageUploadService.getPreviewImages(); // No need for Observable if it's an array
//   }

//   changeSlide(n: number) {
//     this.currentIndex = (this.currentIndex + n + this.slides.length) % this.slides.length;
//   }

//   setSlide(index: number) {
//     this.currentIndex = index;
//   }

//   onImagesUploadxx(event: any) {
//     const files: FileList = event.target.files;
//     if (files.length === 0) return;
//     const newImages: { posts: string; thumbnail: string; caption: string }[] = [];

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
//         newImages.push(imageSrc);
//         this.currentIndex = this.slides.length - 1; // Show the latest uploaded image
//       };
//       reader.readAsDataURL(file);
//       this.uploadedImages.push(file);
//     });

//     setTimeout(() => {
//       this.imageUploadService.addImages(newImages);
//       this.slides = this.imageUploadService.getPreviewImages();
//     }, 500);
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
//         this.uploadedImages.push(file);
//       });

//       setTimeout(() => {
//         this.imageUploadService.addImages(newImages);
//         this.slides = this.imageUploadService.getPreviewImages();
//       }, 500);
//     }
//   }

//   clearUploads() {
//     this.imageUploadService.clearImages();
//     this.slides = [];
//     this.uploadedImages = [];
//     this.currentIndex = 0;
//   }
//   removeImage(index: number) {
//     this.slides.splice(index, 1); // Remove image from array
//   }

//   closeDialog() {
//     this.dialogRef.close();
//     // Do not reset slides to persist data after closing
//   }

//   sendPostImage() {
//     const formData = new FormData();
//     this.uploadedImages.forEach((file) => {
//       formData.append('posts', file);
//     });

//     this.imageUploadService.setImages(formData);
//     this.dialogRef.close();
//   }
// }
import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostUploadImagesService } from 'src/app/services/post-upload-images.service';
import { NsfwDetectorService } from 'src/app/services/DetectorAI/nsfw-detector.service';
import { HttpClient } from '@angular/common/http';
import { SightengineWorkflowService } from 'src/app/services/DetectorAI/sightengine-workflow.service';

interface Slide {
  file?: File;
  url: string;
  caption?: string;
  warning?: string;
}

@Component({
  selector: 'app-post-upload-image',
  templateUrl: './post-upload-image.component.html',
  styleUrls: ['./post-upload-image.component.css'],
})
export class PostUploadImageComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  slides: any = [];
  uploadedImages: File[] = [];
  currentIndex = 0;
  showUploadForm = true;
  i: any;
  btnSave:string="Next";
  
  constructor(
    private dialogRef: MatDialogRef<PostUploadImageComponent>,
    private imageUploadService: PostUploadImagesService,
    private nsfwService: NsfwDetectorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private sightService: SightengineWorkflowService
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

  warning: string = '';
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const imageUrl = e.target.result as string;

      // Create slide preview
      const slide: Slide = {
        file,
        url: imageUrl,
        warning: '',
      };

      // Add slide to UI
      this.slides.push(slide);
      this.currentIndex = this.slides.length - 1;

      // Check image with Sightengine
      this.sightService.checkImage(file).subscribe(
        res => {
          console.log('Sightengine response:', res);

          if (res.summary.action === 'reject') {
            const reasons = res.summary.reject_reason
              .map((r: any) => r.text)
              .join(', ');

            slide.warning = `⚠️ Rejected! (${res.summary.reject_prob}) – ${reasons}`;
          } else {
            slide.warning = '';
          }
        },
        err => console.error('Error checking image:', err)
      );
    };

    reader.readAsDataURL(file);
  }

  allImagesValid(): boolean {
    return this.slides.every((slide: { warning: any; }) => !slide.warning);
  }

  removeSlide(index: number) {
    // Remove from slides array
    this.slides.splice(index, 1);

    // Fix current index if needed
    if (this.currentIndex >= this.slides.length) {
      this.currentIndex = this.slides.length - 1;
    }

    // If no slides left
    if (this.slides.length === 0) {
      this.currentIndex = 0;
    }
  }

  // Slide navigation
  changeSlide(n: number) {
    this.currentIndex = (this.currentIndex + n + this.slides.length) % this.slides.length;
  }

  setSlide(index: number) {
    this.currentIndex = index;
  }

  // Upload images and check for NSFW content
  async onImagesUpload(event: any) {
    const files: FileList = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);

      // Add to slides temporarily
      const slide: any = {
        posts: url,
        thumbnail: url,
        caption: file.name
      };
      this.slides.push(slide);

      // Check for pornography
      const warning = await this.checkPornographic(file);
      if (warning) {
        slide.warning = '⚠️ Adult content detected!';
      }
    }
    this.uploadedImages = Array.from(files);
  }


  private API_URL = 'https://api.sightengine.com/1.0/check.json';
  private API_USER = '1497099119';
  private API_SECRET = 'KE2kugJ8pDFMH7EkpsUUPLFZ6czZdhDu';


  async checkPornographic(file: File): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('media', file);
      formData.append('models', 'nudity');
      formData.append('api_user', this.API_USER);
      formData.append('api_secret', this.API_SECRET);

      const response: any = await this.http.post(this.API_URL, formData).toPromise();

      // Nudity detection score > 0.6 considered adult content
      const nudity = response.nudity?.raw || 0;
      return nudity > 0.6;
    } catch (error) {
      console.error('Porn detection failed', error);
      return false; // fail-safe
    }
  }


  async onImagesUploadx(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    for (let file of Array.from(input.files)) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const imageSrc = e.target.result as string;

        // Detect NSFW content
        let warning = '';
        try {
          const result = await this.nsfwService.detectNSFW(imageSrc).toPromise();
          if (result.isAdult) {
            warning = '⚠️ Adult content detected!';
          }
        } catch (err) {
          console.error('NSFW detection failed', err);
        }

        // Add to slides
        this.slides.push({
          posts: imageSrc,
          thumbnail: imageSrc,
          caption: 'Uploaded Image',
          warning
        });
        this.currentIndex = this.slides.length - 1;
      };
      reader.readAsDataURL(file);
      this.uploadedImages.push(file);
    }

    // Optional: store preview images in service
    setTimeout(() => {
      //   this.imageUploadService.addImages(this.slides.map(s => s.posts));
    }, 500);
  }

  // Remove single image
  removeImage(index: number) {
    this.slides.splice(index, 1);
    this.uploadedImages.splice(index, 1);
    if (this.currentIndex >= this.slides.length) {
      this.currentIndex = this.slides.length - 1;
    }
  }

  // Clear all uploads
  clearUploads() {
    this.slides = [];
    this.uploadedImages = [];
    this.currentIndex = 0;
    this.imageUploadService.clearImages();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  // Submit images to service
  sendPostImage() {
    if (this.slides.length === 0) return;
    const formData = new FormData();
    // Only append real Files (ignore existing slides with only URLs)
    this.slides.forEach((slide: Slide) => {
      if (slide.file) {
        formData.append('posts[]', slide.file);
      }
    });
    
    this.imageUploadService.setImages(formData);

    this.dialogRef.close();
  }

  // sendPostImage() {
  //   const formData = new FormData();
  //   this.uploadedImages.forEach(file => formData.append('posts', file));
  //   this.imageUploadService.setImages(formData);
  //   this.dialogRef.close();
  // }
}
