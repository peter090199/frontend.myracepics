// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-roleselectedui',
//   templateUrl: './roleselectedui.component.html',
//   styleUrls: ['./roleselectedui.component.css']
// })
// export class RoleselecteduiComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-roleselectedui',
  templateUrl: './roleselectedui.component.html',
  styleUrls: ['./roleselectedui.component.css']
})
export class RoleselecteduiComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RoleselecteduiComponent>
  ) {}

  ngOnInit(): void {}

  // Close dialog and pass selected role
  selectRole(role: 'runner' | 'photographer'): void {
    this.dialogRef.close(role);
  }
}
