// import { Component, Inject } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// export interface PreviewImage {
//   image: string;
//   photographer: string;
// }

// @Component({
//   selector: 'app-image-preview-dialog',
//   template: `
//     <div class="preview-overlay">
//       <div class="preview-card">

//         <!-- Image -->
//         <img [src]="images[currentIndex].image"
//              alt="Event Image"
//              class="preview-image"
//              (mousedown)="hideWatermark()"
//              (mouseup)="showWatermark()"
//              (mouseleave)="showWatermark()"
//              (touchstart)="hideWatermark()"
//              (touchend)="showWatermark()"
//         />

//         <!-- Watermark -->
//         <span class="watermark" *ngIf="showingWatermark">{{ images[currentIndex].photographer }}</span>

//         <!-- Navigation Buttons -->
//         <button mat-icon-button class="nav-btn left" (click)="prevImage()" [disabled]="images.length <= 1">
//           <mat-icon>chevron_left</mat-icon>
//         </button>
//         <button mat-icon-button class="nav-btn right" (click)="nextImage()" [disabled]="images.length <= 1">
//           <mat-icon>chevron_right</mat-icon>
//         </button>

//         <!-- Close Button -->
//         <button mat-icon-button class="close-btn" (click)="close()">
//           <mat-icon>close</mat-icon>
//         </button>

//       </div>
//     </div>
//   `,
//   styles: [`
//     .preview-overlay {
//       position: fixed;
//       inset: 0;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       backdrop-filter: blur(8px);
//       background-color: rgba(0,0,0,0.6);
//       z-index: 1000;
//       padding: 10px;
//     }

//     .preview-card {
//       position: relative;
//       max-width: 50vw;
//       max-height: 75vh;
//       background: #fff;
//       border-radius: 12px;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       overflow: hidden;
//       box-shadow: 0 8px 24px rgba(0,0,0,0.3);
//     }

//     .preview-image {
//       max-width: 100%;
//       max-height: 100%;
//       object-fit: contain;
//       border-radius: 8px;
//       user-select: none;
//     }

//     .watermark {
//       position: absolute;
//       bottom: 10px;
//       right: 10px;
//       font-size: 14px;
//       color: rgba(0,0,0,0.5);
//       background-color: rgba(255,255,255,0.7);
//       padding: 4px 8px;
//       border-radius: 4px;
//       pointer-events: none;
//       transition: opacity 0.2s;
//     }

//     .close-btn {
//       position: absolute;
//       top: 10px;
//       right: 10px;
//       color: #000;
//       background-color: rgba(255,255,255,0.8);
//       border-radius: 50%;
//       z-index: 10;
//     }

//     .nav-btn {
//       position: absolute;
//       top: 50%;
//       transform: translateY(-50%);
//       color: #000;
//       background-color: rgba(255,255,255,0.8);
//       border-radius: 50%;
//       z-index: 10;
//     }
//     .nav-btn.left { left: 10px; }
//     .nav-btn.right { right: 10px; }

//     @media (max-width: 768px) {
//       .preview-card { max-width: 90vw; max-height: 60vh; }
//       .watermark { font-size: 12px; padding: 2px 6px; }
//       .nav-btn { width: 32px; height: 32px; top: 45%; }
//       .close-btn { width: 32px; height: 32px; top: 5px; right: 5px; }
//     }
//   `]
// })
// export class ImagePreviewDialogComponent {
//   images: PreviewImage[];
//   currentIndex: number = 0;
//   showingWatermark: boolean = true; // Controls watermark visibility

//   constructor(
//     public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: { images: PreviewImage[], startIndex: number }
//   ) {
//     this.images = data.images;
//     this.currentIndex = data.startIndex || 0;
//   }

//   close() { this.dialogRef.close(); }
//   nextImage() { if (this.currentIndex < this.images.length - 1) this.currentIndex++; }
//   prevImage() { if (this.currentIndex > 0) this.currentIndex--; }

//   hideWatermark() { this.showingWatermark = false; }  // On hold
//   showWatermark() { this.showingWatermark = true; }   // On release
// }


import { Component, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface PreviewImage {
  image: string;
  photographer: string;
}

@Component({
  selector: 'app-image-preview-dialog',
  template: `
    <div class="preview-overlay">
      <div class="preview-card">

        <!-- Canvas for image + watermark -->
        <canvas #canvas
                class="preview-image"
                (mousedown)="hideWatermark($event)"
                (mouseup)="showWatermark($event)"
                (mouseleave)="showWatermark($event)"
                (mousemove)="dragWatermark($event)"
                (touchstart)="hideWatermark($event); startDrag($event)"
                (touchmove)="dragWatermark($event)"
                (touchend)="showWatermark($event); stopDrag()"
        ></canvas>

        <!-- Navigation Buttons -->
        <button mat-icon-button class="nav-btn left" (click)="prevImage()" [disabled]="images.length <= 1">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <button mat-icon-button class="nav-btn right" (click)="nextImage()" [disabled]="images.length <= 1">
          <mat-icon>chevron_right</mat-icon>
        </button>

        <!-- Close Button -->
        <button mat-icon-button class="close-btn" (click)="close()">
          <mat-icon>close</mat-icon>
        </button>

      </div>
    </div>
  `,
  styles: [`
    .preview-overlay {
      position: fixed;
      inset: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(8px);
      background-color: rgba(0,0,0,0.6);
      z-index: 1000;
      padding: 10px;
    }

    .preview-card {
      position: relative;
      max-width: 50vw;
      max-height: 75vh;
      background: #fff;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    }

    canvas.preview-image {
      width: 100%;
      height: 100%;
      border-radius: 8px;
      user-select: none;
      display: block;
    }

    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      color: #ff0505;
      border-radius: 50%;
      z-index: 10;
    }

    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      color: #000;
      background-color: rgba(255,255,255,0.8);
      border-radius: 50%;
      z-index: 10;
    }
    .nav-btn.left { left: 10px; }
    .nav-btn.right { right: 10px; }

    @media (max-width: 768px) {
      .preview-card { max-width: 90vw; max-height: 60vh; }
      .nav-btn { width: 32px; height: 32px; top: 45%; }
      .close-btn { width: 32px; height: 32px; top: 5px; right: 5px; }
    }
  `]
})
export class ImagePreviewDialogComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  images: PreviewImage[];
  currentIndex: number = 0;
  showingWatermark: boolean = true;

  // For drag
  dragging: boolean = false;
  watermarkX: number = 100;
  watermarkY: number = 100;
  watermarkFontSize: number = 30;

  constructor(
    public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { images: PreviewImage[], startIndex: number }
  ) {
    this.images = data.images;
    this.currentIndex = data.startIndex || 0;
  }

  ngAfterViewInit() {
    this.drawCanvas();
  }

  close() { this.dialogRef.close(); }

  nextImage() { 
    if (this.currentIndex < this.images.length - 1) this.currentIndex++;
    this.resetWatermarkPosition();
    this.drawCanvas();
  }

  prevImage() { 
    if (this.currentIndex > 0) this.currentIndex--;
    this.resetWatermarkPosition();
    this.drawCanvas();
  }

  hideWatermark(event?: Event) {
    event?.stopPropagation();
    this.showingWatermark = false;
    this.drawCanvas();
  }

  showWatermark(event?: Event) {
    event?.stopPropagation();
    this.showingWatermark = true;
    this.drawCanvas();
  }

  startDrag(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.dragging = true;
  }

  stopDrag() {
    this.dragging = false;
  }

  dragWatermark(event: MouseEvent | TouchEvent) {
    if (!this.dragging) return;

    let x: number, y: number;
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    if (event instanceof MouseEvent) {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    } else {
      const touch = event.touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    }

    this.watermarkX = x;
    this.watermarkY = y;
    this.drawCanvas();
  }

  resetWatermarkPosition() {
    this.watermarkX = 100;
    this.watermarkY = 100;
  }

  drawCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.images[this.currentIndex].image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      if (this.showingWatermark) {
        ctx.font = `${this.watermarkFontSize}px Arial`;
        ctx.fillStyle = 'rgba(247,7,7,0.4)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.images[this.currentIndex].photographer, this.watermarkX, this.watermarkY);
      }
    };
  }
}
