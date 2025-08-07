import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfessionalService } from 'src/app/services/SharedServices/professional.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';

@Component({
  selector: 'app-add-seminar-ui',
  templateUrl: './add-seminar-ui.component.html',
  styleUrls: ['./add-seminar-ui.component.css']
})
export class AddSeminarUiComponent implements OnInit {
  seminarForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dataService: ProfessionalService,
    private alert: NotificationsService,
    private profileService: ProfessionalService,
    public dialogRef: MatDialogRef<AddSeminarUiComponent>,
    private cvServices: CurriculumVitaeService
  ) { }

  ngOnInit(): void {
   // this.loadSeminarData();
    this.seminarForm = this.fb.group({
      seminar: this.fb.array([
        this.createSeminar()
      ])
    });
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

  resetForm(): void {
    this.seminarForm.setControl('seminar', this.fb.array([
      this.createSeminar()
    ]));
    this.seminarForm.markAsPristine();
    this.seminarForm.markAsUntouched();
  }

// loadSeminarData(): void {
//   this.cvServices.getSeminarByCode().subscribe({
//     next: (res) => {
//       if (res.success && Array.isArray(res.data)) {
//           this.seminars = res.data;
//         // const seminarFormGroups = res.data.map((seminar: any) =>
//         //   this.fb.group({
//         //     seminar_title: [seminar.seminar_title || '', Validators.required],
//         //     seminar_provider: [seminar.seminar_provider || '', Validators.required],
//         //     date_completed: [seminar.date_completed || '', Validators.required],
//         //   })
//         // );

//         // Replace the current seminar form array with the new data
//         this.seminarForm.get('seminar', this.fb.array(seminarFormGroups));
//       } else {
//         this.alert.toastrWarning(res.message || 'No seminar data found.');
//       }
//     },
//     error: (err) => {
//       console.error('Failed to load seminar data:', err);
//       this.alert.toastrError('Failed to load seminar data.');
//     }
//   });
// }



  submitForm(): void {
    if (this.seminarForm.invalid) {
      this.seminarForm.markAllAsTouched();
      return;
    }
    const seminars = this.seminarArray.value.map((item: any) => ({
      seminar_title: item.seminar_title,
      seminar_provider: item.seminar_provider,
      date_completed: this.formatDate(item.date_completed), // ✅ format here
    }));

    const payload = { seminars };
    this.cvServices.saveSeminar(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.alert.toastrSuccess(res.message);
          this.dialogRef.close(true);
        } else {
          this.alert.toastrWarning(res.message);
        }
       //  this.loadSeminarData();

      },
      error: (error) => {
        console.error('❌ Failed to save seminar records:', error);
        this.alert.toastrError('Something went wrong while saving seminars.');
      }
    });
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`; // "YYYY-MM-DD"
  }

}
