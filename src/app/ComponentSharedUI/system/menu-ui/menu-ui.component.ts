import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { MenuService } from 'src/app/services/MasterAdmin/menu.service';

@Component({
  selector: 'app-menu-ui',
  templateUrl: './menu-ui.component.html',
  styleUrls: ['./menu-ui.component.css']
})
export class MenuUIComponent implements OnInit {
  menuForm: FormGroup;
  btnSave: string = 'Save';

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    public dialogRef: MatDialogRef<MenuUIComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alert: NotificationsService
  ) {
    this.menuForm = this.fb.group({
      // ✅ Keep desc_code only if backend needs it, else remove
      // Laravel does not validate desc_code in update, so make it optional
      desc_code: ['top_navigation'],
      description: ['', Validators.required],
      icon: ['', Validators.required],
      class: [''],
      routes: ['', Validators.required],
      sort: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      status: ['A', Validators.required]  // default Active
    });
  }

    descCodeOptions = [
    { value: 'side_bar', viewValue: 'Sidebar' },
    { value: 'top_navigation', viewValue: 'Top Navigation' },
  ];

  ngOnInit(): void {
    if (this.data?.id) {
      this.btnSave = 'Update';
      // ✅ Patch values only that backend accepts
      this.menuForm.patchValue({
        desc_code:this.data.desc_code,
        description: this.data.description,
        icon: this.data.icon,
        class: this.data.class,
        routes: this.data.routes,
        sort: this.data.sort,
        status: this.data.status
      });
    }
  }

  onSubmit(): void {
    if (this.menuForm.invalid) {
      this.menuForm.markAllAsTouched();
      return;
    }

    const formValue = this.menuForm.value;

    if (this.btnSave.toLowerCase() === "update") {
      // ✅ UPDATE
      this.menuService.updatemenu(this.data.id, formValue).subscribe({
        next: (res) => {
          if (res.success) {
            this.alert.toastrSuccess(res.message || 'Updated successfully');
            this.dialogRef.close(true);
          } else {
            this.alert.toastrWarning(res.message || 'Duplicate menu detected.');
          }
        },
        error: (err) => {
          this.alert.toastrError(err.error?.message || 'Error updating menu');
        }
      });
    } else {
      // ✅ CREATE
      this.menuService.saveMenu(formValue).subscribe({
        next: (res) => {
          if (res.success) {
            this.alert.toastrSuccess(res.message || 'Saved successfully');
            this.dialogRef.close(true);
          } else {
            this.alert.toastrWarning(res.message || 'Duplicate menu detected.');
          }
        },
        error: (err) => {
          this.alert.toastrError(err.error?.message || 'Error saving menu');
        }
      });
    }
  }

  onClose(): void {
    this.dialogRef.close(false);
  }
}
