import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfessionalService } from 'src/app/services/SharedServices/professional.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';
import { inject } from '@angular/core/testing';

@Component({
  selector: 'app-add-certificate-ui',
  templateUrl: './add-certificate-ui.component.html',
  styleUrls: ['./add-certificate-ui.component.css']
})
export class AddCertificateUiComponent implements OnInit {
  certificateForm: FormGroup;
  dataList: any[] = [];
  btnSave: string = "Save";

  constructor(private fb: FormBuilder, private dataService: ProfessionalService,
    private datePipe: DatePipe, private alert: NotificationsService, public dialogRef: MatDialogRef<AddCertificateUiComponent>,
    private cvDataServices: CurriculumVitaeService, @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    this.certificateForm = this.fb.group({
      certificate: this.fb.array([
        this.createCertificate() // Initializes the first FormGroup
      ])
    });


    if (this.data?.id) {
      this.btnSave = 'Update';
      this.patchFormData(this.data);
    }
  }

  patchFormData(data: any) {
    const group = this.certificateArray.at(0) as FormGroup;
    group.patchValue({
      certificate_title: data.certificate_title,
      certificate_provider: data.certificate_provider,
      date_completed: data.date_completed ? new Date(data.date_completed) : ''
    });
  }

  get certificateArray(): FormArray {
    return this.certificateForm.get('certificate') as FormArray;
  }
  addCertificate(): void {
    this.certificateArray.push(this.createCertificate());
  }
  createCertificate(): FormGroup {
    return this.fb.group({
      certificate_title: ['', Validators.required],
      certificate_provider: ['', Validators.required],
      date_completed: ['', Validators.required],
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

  listData: any[] = [];
  loading: boolean = false;
  submitForm(): void {
    if (this.certificateForm.invalid) {
      this.certificateForm.markAllAsTouched();
      return;
    }
    let payload = this.certificateForm.get('certificate')?.value || [];
    payload = payload.map((item: { date_completed: string | number | Date; }) => ({
      ...item,
      date_completed: this.datePipe.transform(item.date_completed, 'yyyy-MM-dd')
    }));
    console.log('🚀 Sending payload:', payload);
    this.loading = true;

    if (this.btnSave === 'Save') {
      this.cvDataServices.saveCertificates(payload).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success) {
            this.alert.toastrSuccess(res.message);
            this.dialogRef.close(true);
          } else {
            this.alert.toastrWarning(res.message);
          }
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 422 && err.error?.message) {
            this.alert.toastrWarning(err.error.message);
          } else {
            this.alert.toastrError('Failed to save seminar');
          }
        }
      });

    } else {
      const data = payload[0]; // only the first one
      this.cvDataServices.updateCertificates(this.data.id, data).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.success) {
            this.alert.toastrSuccess(res.message);
            this.dialogRef.close(true);
          } else {
            this.alert.toastrWarning(res.message);
          }
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 422 && err.error?.message) {
            this.alert.toastrWarning(err.error.message);
          } else {
            this.alert.toastrError('Failed to save seminar');
          }
        }
      });
    }
  }

  submitFormxx(): void {
    if (this.certificateForm.invalid) {
      this.certificateForm.markAllAsTouched();
      return;
    }

    // ✅ Send directly as array
    let payload = this.certificateForm.get('certificate')?.value || [];

    // ✅ Format date to YYYY-MM-DD for backend
    payload = payload.map((item: { date_completed: string | number | Date; }) => ({
      ...item,
      date_completed: this.datePipe.transform(item.date_completed, 'yyyy-MM-dd')
    }));

    console.log('🚀 Sending payload:', payload);

    this.cvDataServices.saveCertificates(payload).subscribe({
      next: (res) => {
        if (res.success === true) {
          this.alert.toastrSuccess(res.message);
          this.dialogRef.close(true);
          this.resetForm();
        } else {
          this.alert.toastrWarning(res.message);
        }
      },
      error: (error) => {
        console.error('❌ Failed to save training records:', error);
      }
    });
  }


  resetForm(): void {
    while (this.certificateArray.length !== 0) {
      this.certificateArray.removeAt(0);
    }
    this.certificateArray.push(this.createCertificate()); // Reset with one blank group
    this.certificateForm.reset();
  }
  //certificate
  removeItemFromArray6(arrayName: 'certificate', index: number) {
    const formArray = this.certificateForm.get(
      `${arrayName}`
    ) as FormArray;
    formArray.removeAt(index);
  }



}
