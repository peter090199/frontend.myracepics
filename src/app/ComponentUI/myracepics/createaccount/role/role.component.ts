import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<RoleComponent>
  ) {}

  ngOnInit(): void {}

  // Close dialog and pass selected role
  selectRole(role: 'runner' | 'photographer'): void {
    this.dialogRef.close(role);
  }
}
