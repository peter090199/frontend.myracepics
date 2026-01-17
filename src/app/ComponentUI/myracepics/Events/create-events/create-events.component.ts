import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { EventsService } from 'src/app/services/myracepics/MyEvents/events.service';

interface Event {
  id?: number;
  title: string;
  location: string;
  date: string;
  category: string;
  image?: string;
}

@Component({
  selector: 'app-create-events',
  templateUrl: './create-events.component.html',
  styleUrls: ['./create-events.component.css']
})
export class CreateEventsComponent implements OnInit {

  btnSave: string = 'Save';
  loading: boolean = false;
  imagePreview: string | null = null;

  eventForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    title: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    image: new FormControl('')
  });

  constructor(
    @Optional() private dialogRef?: MatDialogRef<CreateEventsComponent>,
    private eventService?: EventsService,
    private notificationService?: NotificationsService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: Event // pass data when updating
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.btnSave = 'Update';
      this.loadFormData();
    }
  }

  // Load event data into form for editing
  loadFormData() {
    this.eventForm.patchValue({
      id: this.data?.id,
      title: this.data?.title,
      location: this.data?.location,
      date: this.data?.date,
      category: this.data?.category,
      image: this.data?.image
    });
    this.imagePreview = this.data?.image || null;
  }

  // Handle image selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.eventForm.controls['image'].setValue(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  onClose() {
    // Only close dialog if dialogRef exists
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.notificationService?.toastrWarning('Please fill in all required fields.');
      return;
    }

    const eventData: Event = this.eventForm.value;
    this.loading = true;

    if (this.btnSave === 'Save') {
      this.eventService?.saveEvent(eventData).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.notificationService?.toastrSuccess(res.message || 'Event saved successfully!');
            this.resetForm();
            if (this.dialogRef) this.dialogRef.close(res.event);
          } else {
            this.notificationService?.toastrError(res.message || 'Failed to save event.');
          }
          this.loading = false;
        },
        error: (err) => {
          this.notificationService?.toastrError(err.error || 'Server error.');
          this.loading = false;
        }
      });
    } else if (this.btnSave === 'Update') {
      // this.eventService?.updateEvent(eventData.id!, eventData).subscribe({
      //   next: (res: any) => {
      //     if (res.success) {
      //       this.notificationService?.toastrSuccess(res.message || 'Event updated successfully!');
      //       this.resetForm();
      //       if (this.dialogRef) this.dialogRef.close(res.event);
      //     } else {
      //       this.notificationService?.toastrWarning(res.message || 'Failed to update event.');
      //     }
      //     this.loading = false;
      //   },
      //   error: (err) => {
      //     this.notificationService?.toastrWarning(err.error || 'Server error.');
      //     this.loading = false;
      //   }
      // });
    }
  }

  resetForm() {
    this.eventForm.reset();
    this.imagePreview = null;
    this.btnSave = 'Save';
  }
}
