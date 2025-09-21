import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';

@Component({
  selector: 'app-add-edit-seminar',
  templateUrl: './add-edit-seminar.component.html',
  styleUrls: ['./add-edit-seminar.component.css']
})
export class AddEditSeminarComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddEditSeminarComponent>,   // ✅ fixed wrong ref component
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationService: NotificationsService,
    private cvServices: CurriculumVitaeService
  ) { }

  seminarDate: string = '';
  separatorKeysCodes: number[] = [ENTER, COMMA];
  loading: boolean = false;

  ngOnInit(): void {
    // if editing, format the incoming date once
    if (this.data?.date_completed) {
      this.seminarDate = this.formatDate(this.data.date_completed);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`; // YYYY-MM-DD
  }

  onSubmit(): void {
    this.loading = true;

    // ✅ Ensure date is properly formatted before sending
    if (this.seminarDate) {
     
      this.data.date_completed = this.formatDate(this.seminarDate);
       console.log(this.data.date_completed)
    }

    this.cvServices.updateSeminar(this.data.id, this.data).subscribe({
      next: (res) => {
        if (res.success) {
          this.notificationService.toastrSuccess(res.message);
          this.dialogRef.close(true); // ✅ close dialog on success
        } else {
          this.notificationService.toastrWarning(res.message);
        }
        this.loading = false;
      },
      error: (err) => {
        this.notificationService.toastrWarning(err.error);
        this.loading = false;
      },
    });
  }
}
