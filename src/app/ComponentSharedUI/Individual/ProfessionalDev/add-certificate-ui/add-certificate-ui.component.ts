import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfessionalService } from 'src/app/services/SharedServices/professional.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';

@Component({
  selector: 'app-add-certificate-ui',
  templateUrl: './add-certificate-ui.component.html',
  styleUrls: ['./add-certificate-ui.component.css']
})
export class AddCertificateUiComponent implements OnInit {
  certificateForm:FormGroup;
  dataList: any[] = []; 

  constructor(private fb:FormBuilder,private dataService:ProfessionalService,
    private datePipe:DatePipe,private alert:NotificationsService,public dialogRef: MatDialogRef<AddCertificateUiComponent>,
    private cvDataServices:CurriculumVitaeService

  ) { }

  ngOnInit(): void {
    this.certificateForm = this.fb.group({
      certificate: this.fb.array([
        this.createCertificate() // Initializes the first FormGroup
      ])
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

  listData: any[] = [];
submitForm(): void {
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
