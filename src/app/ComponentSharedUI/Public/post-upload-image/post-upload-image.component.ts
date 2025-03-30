import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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


  constructor(private dialogRef: MatDialogRef<PostUploadImageComponent>,
              private imageUploadService:PostUploadImagesService

  ) { }

  ngOnInit(): void {
  }

  // slides = [
  //   { image: 'assets/images/default.png', thumbnail: 'assets/images/default.png', caption: 'The Woods' },
  //   { image: 'assets/images/default.png', thumbnail: 'assets/images/default.png', caption: 'Cinque Terre' },
  //   { image: 'assets/images/default2.png', thumbnail: 'assets/images/default2.png', caption: 'Mountains and fjords' },
  //   { image: 'assets/images/default2.png', thumbnail: 'assets/images/default2.png', caption: 'Northern Lights' },
  //   { image: 'assets/images/default.png', thumbnail: 'assets/images/default.png', caption: 'Nature and sunrise' },
  //   { image: 'assets/images/default2.png', thumbnail: 'assets/images/default2.png', caption: 'Snowy Mountains' },
  // ];


  changeSlide(n: number) {
    this.currentIndex = (this.currentIndex + n + this.slides.length) % this.slides.length;
  }

  setSlide(index: number) {
    this.currentIndex = index;
  }


  uploadedImages: File[] = [];
  onImagesUpload(event: any) {
    const files: FileList = event.target.files;
    if (files.length === 0) return;

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
        this.currentIndex = this.slides.length - 1; // Show the latest uploaded image
      };
      reader.readAsDataURL(file);
      this.uploadedImages.push(file);
    });
  }



  clearUploads() {
    this.slides =[];
    this.uploadedImages = [];
    this.currentIndex = 0; // Reset to the first slide
  }

  closeDialog() {
    this.dialogRef.close();
  }

  sendPostImage() {
    const formData = new FormData();
    this.uploadedImages.forEach((file) => {
      formData.append('posts', file);
    });

    console.log(formData)
    this.imageUploadService.setImages(formData);

    // Send the images data back to the parent component
    this.dialogRef.close(formData);
  }

}
