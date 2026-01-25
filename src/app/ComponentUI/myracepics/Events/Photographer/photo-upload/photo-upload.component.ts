import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { _url } from 'src/global-variables';
import { SharedService } from 'src/app/services/SharedServices/shared.service';
import { EventsService } from 'src/app/services/myracepics/MyEvents/events.service';

interface UploadFile {
  file: File;
  preview: string | ArrayBuffer | null;
}

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.css']
})
export class PhotoUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  files: UploadFile[] = [];
  isDragOver = false;

  loading = true;
  event: any = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private eventService: EventsService,
    public sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const uuid = params.get('uuid');
      console.log(uuid)
      if (uuid) {
        this.loadEvent(uuid);
      }
    });
  }

  loadEvent(uuid: any) {
    this.loading = true;
    this.eventService.getEventByUuid(uuid).subscribe({
      next: (res: any) => {
        if (!res.event) {
          this.event = null;
          this.loading = false;
          return;
        }
        const images = this.sharedService.getImageUrl(res.event.image);
        this.event = {
          ...res.event,
          image: images,
        };

        this.loading = false;
      },
      error: err => {
        console.error('[EventComponent] Error loading event:', err);
        this.loading = false;
      }
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDragOver = false;
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files) {
      this.addFiles(event.dataTransfer.files);
    }
  }

  onFileSelected(event: any) {
    if (event.target.files) {
      this.addFiles(event.target.files);
    }
  }

  addFiles(fileList: FileList) {
    Array.from(fileList).forEach(file => {
      if (!['image/jpeg', 'image/png'].includes(file.type)) return;
      if (file.size > 10 * 1024 * 1024) return;

      const reader = new FileReader();
      reader.onload = () => {
        this.files.push({ file, preview: reader.result });
      };
      reader.readAsDataURL(file);
    });
  }

  removeFile(file: UploadFile) {
    this.files = this.files.filter(f => f !== file);
  }

  uploadFiles() {
    if (!this.event) return;

    const formData = new FormData();
    this.files.forEach(f => formData.append('photos[]', f.file));

    this.http
      .post(`${_url}events/${this.event.uuid}/photos/upload`, formData)
      .subscribe({
        next: res => {
          console.log('Upload successful', res);
          this.files = [];
        },
        error: err => {
          console.error('Upload failed', err);
        }
      });
  }
}
