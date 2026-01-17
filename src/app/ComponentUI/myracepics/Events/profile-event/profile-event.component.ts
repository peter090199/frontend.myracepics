import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

import { ImagePreviewDialogComponent, PreviewImage } from '../image-preview-dialog/image-preview-dialog.component';
import { ImagesService } from 'src/app/services/myracepics/cart/images.service';
import { EventsService } from 'src/app/services/myracepics/MyEvents/events.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';

/* =======================
   INTERFACES
======================= */

export interface EventImage {
  id?: number;
  title: string;
  image: string;
  location: string;
  date: string;
  status: 'Running' | 'Upcoming' | 'Completed';
  photographer: string;
  price?: number;
}

@Component({
  selector: 'app-profile-event',
  templateUrl: './profile-event.component.html',
  styleUrls: ['./profile-event.component.css']
})
export class ProfileEventComponent implements OnInit {

  /* =======================
     STATE
  ======================= */

  loading = true;
  isMobile = false;
  sidebarOpened = false;

  uuid!: string;
  event: any = [];

  images: any[] = [];
  cart: EventImage[] = [];

  @ViewChild('sidenav') sidenav!: MatSidenav;

  /* =======================
     CONSTRUCTOR
  ======================= */

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private cartService: ImagesService,
    private eventService: EventsService,
    private alert: NotificationsService
  ) { }

  /* =======================
     LIFECYCLE
  ======================= */

  ngOnInit(): void {
    this.checkScreen();

    this.route.paramMap.subscribe(params => {
      const uuid = params.get('uuid');
      if (uuid) {
        this.loadEvent(uuid);
      }
    });

  }

  /* =======================
     RESPONSIVE
  ======================= */

  @HostListener('window:resize')
  checkScreen(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSidenav(): void {
    this.sidebarOpened = !this.sidebarOpened;
  }

  // apiBaseUrl = 'http://localhost:4200/'; // Replace with your actual base URL
  // getImageUrl(path: string): string {
  //   return `${this.apiBaseUrl}${path}`;
  // }

  /* =======================
     API
  ======================= */
  loadEvent(uuid: any) {
    this.loading = true;

    this.eventService.getEventByUuid(uuid).subscribe({
      next: (res: any) => {
        if (!res.event) {
          this.event = null;
          this.loading = false;
          return;
        }

        const images = this.parseImages(res.event.image);

        this.event = {
          ...res.event,
          image: images,
          imageLoaded: new Array(images.length).fill(false) // track image load
        };

        this.loading = false;
      },
      error: err => {
        console.error('[EventComponent] Error loading event:', err);
        this.loading = false;
      }
    });
  }

  /** Convert image field (string or JSON) into array of secure URLs */
  private parseImages(imageField: any): string[] {
    if (!imageField) return [];

    try {
      // If the field is JSON array, parse it; else treat as single string
      const images: string[] = Array.isArray(imageField)
        ? imageField
        : imageField.startsWith('[') ? JSON.parse(imageField) : [imageField];

      // Convert each image path to secure backend URL
      return images.map(img =>
        img.startsWith('http')
          ? img
          : `https://backend.myracepics.com/${encodeURIComponent(img.replace(/^\//, ''))}`
      );

    } catch (err) {
      console.error('Error parsing images', err);
      return [];
    }
  }

  /** Convert image field (string or JSON) into array of secure URLs */
  private parseImagesxx(imageField: any): string[] {
    if (!imageField) return [];

    try {
      // If the field is JSON array, parse it; else treat as single string
      const images: string[] = Array.isArray(imageField)
        ? imageField
        : imageField.startsWith('[') ? JSON.parse(imageField) : [imageField];

      // Convert each image path to secure backend URL
      return images.map(img =>
        img.startsWith('http')
          ? img
          : `https://backend.myracepics.com/api/secure-image/${encodeURIComponent(img.replace(/^\//, ''))}`
      );

    } catch (err) {
      console.error('Error parsing images', err);
      return [];
    }
  }


  // loadEvent(uuid: any): void {
  //   this.loading = true;
  //   this.eventService.getEventByUuid(uuid).subscribe({
  //     next: (res) => {
  //       this.event = res.event;
  //       console.log('Loaded Event:', res.event);

  //       this.images = (res.event?.image || []).map((img: any) => ({
  //         title: res.event.title,
  //         image: img.url,
  //         location: res.event.location,
  //         date: res.event.date,
  //         status: res.event.status,
  //         photographer: img.photographer || 'Official Photographer',
  //         price: img.price || 0
  //       }));
  //       this.loading = false;
  //     },
  //     error: () => {
  //       this.alert.toastrError('Failed to load event.');
  //       this.loading = false;
  //     }
  //   });
  // }

  // loadEvent(uuid: string): void {
  //   this.loading = true;
  //   this.eventService.getEventByUuid(uuid).subscribe((res: any) => {
  //     const event = res.event;

  //     this.event = {
  //       ...event,
  //       image: Array.isArray(event.image)
  //         ? event.image
  //         : JSON.parse(event.image) // 👈 FIX
  //     };

  //   // this.eventService.getEventByUuid(uuid).subscribe({
  //   //   next: (res: any) => {
  //   //     this.event = res.event;
  //   //     console.log('Loaded Event:', this.event);

  //   //     this.images = (res.event?.images || []).map((img: any) => ({
  //   //       title: res.event.title,
  //   //       image: img.url,
  //   //       location: res.event.location,
  //   //       date: res.event.date,
  //   //       status: res.event.status,
  //   //       photographer: img.photographer || 'Official Photographer',
  //   //       price: img.price || 0
  //   //     }));

  //       this.loading = false;
  //     //},
  //     error: () => {
  //       this.alert.toastrError('Failed to load event.');
  //       this.loading = false;
  //     }
  //   });
  // }

  /* =======================
     IMAGE PREVIEW
  ======================= */

  previewImages(startIndex = 0): void {
    const previews: PreviewImage[] = [];

    Promise.all(
      this.images.map(img =>
        this.generateWatermarkedImage(img.image, img.photographer)
      )
    ).then(urls => {
      urls.forEach((url, i) => {
        previews.push({
          image: url,
          photographer: this.images[i].photographer
        });
      });

      this.dialog.open(ImagePreviewDialogComponent, {
        data: { images: previews, startIndex },
        panelClass: 'custom-dialog-container'
      });
    });
  }

  generateWatermarkedImage(imageUrl: string, photographer: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);

        const fontSize = Math.max(24, Math.floor(img.width / 20));
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'rgba(247, 7, 7, 0.35)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.rotate(-Math.PI / 6);

        for (let y = 0; y < img.height; y += fontSize * 4) {
          for (let x = 0; x < img.width; x += fontSize * 8) {
            ctx.fillText(photographer, x, y);
          }
        }

        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = err => reject(err);
    });
  }

  /* =======================
     CART
  ======================= */

  isInCart(image: EventImage): boolean {
    return this.cart.some(i => i.image === image.image);
  }

  addToCart(image: EventImage): void {
    if (this.isInCart(image)) {
      this.alert.toastrWarning('Already in cart');
      return;
    }

    this.cart.push(image);
    this.cartService.addToCart(image);
  }

  // removeFromCart(image: EventImage): void {
  //   this.cart = this.cart.filter(i => i.image !== image.image);
  //   this.cartService.removeFromCart(image);
  // }

  getCartTotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  checkout(): void {
    console.log('Checkout:', this.cart);
  }

  buyNow(image: EventImage): void {
    this.cart = [image];
    this.checkout();
  }
}
