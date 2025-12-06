import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-job-view-details',
  templateUrl: './job-view-details.component.html',
  styleUrls: ['./job-view-details.component.css']
})
export class JobViewDetailsComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<JobViewDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  closeDialog(): void {
    this.dialogRef.close();
  }

}
