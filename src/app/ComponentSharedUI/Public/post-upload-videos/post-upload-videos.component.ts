import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-upload-videos',
  templateUrl: './post-upload-videos.component.html',
  styleUrls: ['./post-upload-videos.component.css']
})
export class PostUploadVideosComponent implements OnInit {

  btnSave: string = "Next";

  videos: any[] = [];
  currentIndex: number = 0;

  constructor() {}

  ngOnInit(): void {}

  /** When user selects videos */
 onVideoSelected(event: any) {
  const files: File[] = Array.from(event.target.files);

  this.videos = []; // reset old videos

  for (let file of files) {
    const url = URL.createObjectURL(file);

    let warning = '';
    if (file.size > 50 * 1024 * 1024) {
      warning = 'Video exceeds 50MB limit.';
    }

    this.videos.push({
      file,
      url,
      warning
    });
  }

  // Auto show first video
  this.currentIndex = 0;
}


  /** Change thumbnail slide */
  setSlide(i: number) {
    this.currentIndex = i;
  }

  /** Next / Previous slide */
  changeSlide(n: number) {
    const total = this.videos.length;
    this.currentIndex = (this.currentIndex + n + total) % total;
  }

  /** Remove one video */
  removeVideo(i: number) {
    this.videos.splice(i, 1);

    if (this.currentIndex >= this.videos.length) {
      this.currentIndex = this.videos.length - 1;
    }

    if (this.videos.length === 0) {
      this.currentIndex = 0;
    }
  }

  /** Clear all */
  clearVideos() {
    this.videos = [];
    this.currentIndex = 0;
  }

  /** Validation */
  allVideosValid() {
    return this.videos.every(v => !v.warning);
  }

  /** Final upload */
  sendPostVideo() {
    console.log("Uploading videos:", this.videos);

    // Add your upload logic here
  }

}
