import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfessionalService } from 'src/app/services/SharedServices/professional.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-employment-ui',
  templateUrl: './add-employment-ui.component.html',
  styleUrls: ['./add-employment-ui.component.css']
})
export class AddEmploymentUiComponent implements OnInit {
  dataList: any[] = []; 
  employmentForm:FormGroup;

  constructor(private fb:FormBuilder,private dataService: ProfessionalService,
    private alert:NotificationsService,public dialogRef: MatDialogRef<AddEmploymentUiComponent>,
    private cvDataServices:CurriculumVitaeService, private datePipe:DatePipe
  ) { }

  ngOnInit(): void {
    this.employmentForm = this.fb.group({
      employment: this.fb.array([
        this.createEmployment() // Initializes the first FormGroup
      ])
    });
  }

  get employmentArray(): FormArray {
    return this.employmentForm.get('employment') as FormArray;
  }

  addEmployment(): void {
    this.employmentArray.push(this.createEmployment());
  }

  //employment
  createEmployment(): FormGroup {
    return this.fb.group({
      company_name: ['', Validators.required],
      position: ['', Validators.required],
      job_description: ['', Validators.required],
      date_completed: ['', Validators.required],
    });
  }

//employment
removeItemFromArray5(arrayName: 'employment', index: number) {
  const formArray = this.employmentForm.get(
    `${arrayName}`
  ) as FormArray;
  formArray.removeAt(index);
}


 
workList: any[] = [];
submitForm(): void {
    if (this.employmentForm.invalid) {
      this.employmentForm.markAllAsTouched();
      return;
    }
    let payload = this.employmentForm.get('employment')?.value || [];
    payload = payload.map((item: { date_completed: string | number | Date; }) => ({
      ...item,
      date_completed: this.datePipe.transform(item.date_completed, 'yyyy-MM-dd')
    }));
    this.cvDataServices.saveEmployment(payload).subscribe({
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
  while (this.employmentArray.length !== 0) {
    this.employmentArray.removeAt(0);
  }
  this.employmentArray.push(this.createEmployment()); // Reset with one blank group
  this.employmentForm.reset();
}

}
