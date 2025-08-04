import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';

@Component({
  selector: 'app-add-edit-education-dialog',
  templateUrl: './add-edit-education-dialog.component.html',
  styleUrls: ['./add-edit-education-dialog.component.css']
})
export class AddEditEducationDialogComponent implements OnInit {
  educationForm!: FormGroup;
  years: number[] = [];
  btnSave: string = "Save";
  loading: boolean = false;
  success: boolean = true;


  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  educationStatusOptions = [
    { value: 'graduate', label: 'Graduate' },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'ongoing', label: 'Ongoing' },
  ];

  constructor(
    public dialogRef: MatDialogRef<AddEditEducationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alert: NotificationsService,
    private fb: FormBuilder,private educationServices:CurriculumVitaeService
  ) {

    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      this.years.push(year);
    }
  }

  ngOnInit(): void {
   // this.loadEducationData();
    this.educationForm = this.fb.group({
      highest_education: [this.data?.highest_education || '', [Validators.required, Validators.maxLength(255)]],
      school_name: [this.data?.school_name || '', [Validators.required, Validators.maxLength(255)]],
      start_month: [this.data?.start_month || '', Validators.required],
      start_year: [this.data?.start_year || '', Validators.required],
      end_month: [this.data?.end_month || '', Validators.required],
      end_year: [this.data?.end_year || '', Validators.required],
      status: [this.data?.status || '', Validators.required],

    });

    if (this.data.id) {
      this.btnSave = "Update";
    }
  }

  formatStatus(value: any): string {
    const validOptions = ['Graduate', 'Undergraduate', 'Ongoing'];
    if (!value) return '';
    const formatted = value.toString().trim().toLowerCase();

    return validOptions.find(opt => opt.toLowerCase() === formatted) || '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
submitForm(): void {
 
  const payload = this.educationForm.value;
  this.loading = true;

  this.educationServices.updateEducationById(this.data.id, payload).subscribe({
    next: (res) => {
      this.loading = false;
      if (res.success == true) {
        this.alert.toastrSuccess(res.message);
        this.dialogRef.close(true); // Close and return result to parent
      } else {
        this.alert.toastrWarning(res.message);
      }
    },
    error: (err) => {
      this.loading = false;
      console.error('❌ Update error:', err);
      this.alert.toastrError('Something went wrong while updating.');
    }
  });
}


 loadEducationData() {
    this.educationServices.getEducationsByCode().subscribe({
      next: (res) => {
        if (res.success == true) {
          this.educationForm = res.data;
        } else {
          this.alert.toastrWarning(res.message);
        }
      }, 
      error: (err) => {
      //  console.error('API error:', err);
      },
    });
  }
 
}


