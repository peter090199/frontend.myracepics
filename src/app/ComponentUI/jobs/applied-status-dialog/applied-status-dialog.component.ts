import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-applied-status-dialog',
  templateUrl: './applied-status-dialog.component.html',
  styleUrls: ['./applied-status-dialog.component.css']
})
export class AppliedStatusDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AppliedStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  
  ngOnInit(): void {
  }
  
  close() {
    this.dialogRef.close();
  }
}
