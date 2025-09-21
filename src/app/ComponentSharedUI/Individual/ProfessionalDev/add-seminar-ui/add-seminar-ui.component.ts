import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';

@Component({
  selector: 'app-add-seminar-ui',
  templateUrl: './add-seminar-ui.component.html',
  styleUrls: ['./add-seminar-ui.component.css']
})
export class AddSeminarUiComponent implements OnInit {
  seminarForm!: FormGroup;
  btnSave: string = 'Save';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cvServices: CurriculumVitaeService,
    private notificationService: NotificationsService,
    public dialogRef: MatDialogRef<AddSeminarUiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.seminarForm = this.fb.group({
      seminar: this.fb.array([this.createSeminar()])
    });

    if (this.data?.id) {
      this.btnSave = 'Update';
      this.patchFormData(this.data);
    }
  }

  get seminarArray(): FormArray {
    return this.seminarForm.get('seminar') as FormArray;
  }

  createSeminar(): FormGroup {
    return this.fb.group({
      seminar_title: ['', Validators.required],
      seminar_provider: ['', Validators.required],
      date_completed: ['', Validators.required]
    });
  }

  addSeminar(): void {
    this.seminarArray.push(this.createSeminar());
  }

  removeItemFromArray4(arrayName: 'seminar', index: number): void {
    const formArray = this.seminarForm.get(arrayName) as FormArray;
    formArray.removeAt(index);
  }

  patchFormData(data: any) {
    const group = this.seminarArray.at(0) as FormGroup;
    group.patchValue({
      seminar_title: data.seminar_title,
      seminar_provider: data.seminar_provider,
      date_completed: data.date_completed ? new Date(data.date_completed) : ''
    });
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`; // YYYY-MM-DD
  }

  submitFormxx(): void {
    if (this.seminarForm.invalid) {
      this.seminarForm.markAllAsTouched();
      return;
    }

    const seminars = this.seminarArray.value.map((item: any) => ({
      seminar_title: item.seminar_title,
      seminar_provider: item.seminar_provider,
      date_completed: this.formatDate(item.date_completed),
    }));

    this.loading = true;

    const payload = { seminars };

    this.cvServices.saveSeminar(payload).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.notificationService.toastrSuccess(res.message);
          this.dialogRef.close(true);
        } else {
          // ✅ Show warning popup if API returns a warning message
          this.notificationService.toastrWarning(res.message);
        }
      },
      error: (err) => {
        this.loading = false;
        // Handle validation error from Laravel (422)
        if (err.status === 422 && err.error?.message) {
          this.notificationService.toastrWarning(err.error.message);
        } else {
          this.notificationService.toastrError('Failed to save seminar');
        }
      }
    });
  }


  submitForm(): void {
    if (this.seminarForm.invalid) {
      this.seminarForm.markAllAsTouched();
      return;
    }

    const seminars = this.seminarArray.value.map((item: any) => ({
      seminar_title: item.seminar_title,
      seminar_provider: item.seminar_provider,
      date_completed: this.formatDate(item.date_completed),
    }));

    this.loading = true;

    if (this.btnSave === 'Save') {
      const payload = { seminars };
      this.cvServices.saveSeminar(payload).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success == true) 
            {
            this.notificationService.toastrSuccess(res.message);
            this.dialogRef.close(true);
          }
          else{
            this.notificationService.toastrWarning(res.message);
          }
        },
        error: (err) => {
         if (err.status === 422 && err.error?.message) {
          this.notificationService.toastrWarning(err.error.message);
        } else {
          this.notificationService.toastrError('Failed to save seminar');
        }
        }
      });

    } 
    else {
      const seminar = seminars[0]; // only the first one
      this.cvServices.updateSeminar(this.data.id, seminar).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success) {
            this.notificationService.toastrSuccess(res.message);
            this.dialogRef.close(true);
          } else {
            this.notificationService.toastrWarning(res.message);
          }
        },
        error: (err) => {
          if (err.status === 422 && err.error?.message) {
          this.notificationService.toastrWarning(err.error.message);
        } else {
          this.notificationService.toastrError('Failed to save seminar');
        }
        }
      });
    }
  }

}
