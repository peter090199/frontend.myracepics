// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-submenu-ui',
//   templateUrl: './submenu-ui.component.html',
//   styleUrls: ['./submenu-ui.component.css']
// })
// export class SubmenuUIComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SubMenuService } from 'src/app/services/MasterAdmin/sub-menu.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
@Component({
  selector: 'app-submenu-ui',
  templateUrl: './submenu-ui.component.html',
  styleUrls: ['./submenu-ui.component.css']
})
export class SubmenuUIComponent implements OnInit {
  transNo: any;
  submenuForm!: FormGroup;
  btnSave: string = "Save";

  constructor(
    private fb: FormBuilder,
    private submenuService: SubMenuService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alert: NotificationsService,
    public dialogRef: MatDialogRef<SubmenuUIComponent>,
  ) {
    this.transNo = data.transNo;
  }

  ngOnInit(): void {

      if (this.data) {
        this.btnSave = "Update";
        //this.roleForm.controls['empID'].disable();
        //  this.GetItemFormData();

    }


    // Initialize the form with transNo
    this.submenuForm = this.fb.group({
      transNo: [this.transNo, Validators.required], // Ensure transNo is part of the form
      lines: this.fb.array([this.createSubmenu()]) // Initialize with one submenu entry
    });
  }

  // Method to create a submenu entry with validations
  createSubmenu(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(255)]],
      icon: ['', Validators.required],
      class: ['', Validators.required],
      routes: ['', Validators.required],
      sort: [null, [Validators.required, Validators.min(1)]],
      status: ['A']
    });
  }

  // Getter for lines FormArray
  get lines(): FormArray {
    return this.submenuForm.get('lines') as FormArray;
  }

  // Method to add a new submenu entry
  addSubmenu(): void {
    this.lines.push(this.createSubmenu());
  }

  // Method to remove a submenu entry
  removeSubmenu(index: number): void {
    this.lines.removeAt(index);
  }


  saveSubmenus(): void {
    if (this.submenuForm.invalid) {
      this.alert.toastrError("Form is invalid!");
      this.submenuForm.markAllAsTouched(); // highlight invalid fields
      return;
    }
    const data = this.submenuForm.value;
    this.submenuService.saveSubmenu(data).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.alert.toastrSuccess(res.message || 'Saved successfully');
          this.dialogRef.close(true);  // close dialog and refresh parent
          this.resetForm();            // reset form if needed
        } else {
          this.alert.toastrWarning(res.message || 'Something went wrong');
        }
      },
      error: () => {
        this.alert.toastrError('Server error. Please try again.');
      }
    });
  }

  resetForm(): void {
    while (this.lines.length !== 0) {
      this.lines.removeAt(0);
    }
    this.lines.push(this.createSubmenu());
    this.submenuForm.reset();
  }



}

