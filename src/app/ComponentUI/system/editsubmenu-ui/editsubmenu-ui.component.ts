import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubMenuService } from 'src/app/services/MasterAdmin/sub-menu.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';

@Component({
  selector: 'app-editsubmenu-ui',
  templateUrl: './editsubmenu-ui.component.html',
  styleUrls: ['./editsubmenu-ui.component.css']
})
export class EditsubmenuUIComponent implements OnInit {
  transNo: any;
  submenuForm!: FormGroup;
  btnSave: string = "Save";

  constructor(
    private fb: FormBuilder,
    private submenuService: SubMenuService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alert: NotificationsService,
    public dialogRef: MatDialogRef<EditsubmenuUIComponent>,
  ) {
    this.transNo = data.transNo;
  }

  ngOnInit(): void {
    this.submenuForm = this.fb.group({
      transNo: [this.transNo, Validators.required],
      description: ['', [Validators.required, Validators.maxLength(255)]],
      icon: ['', Validators.required],
      class: ['', Validators.required],
      routes: ['', Validators.required],
      sort: [null, [Validators.required, Validators.min(1)]],
      status: ['A']
    });

    if (this.data && this.data.id) {
      this.btnSave = "Update";
      this.GetItemFormData();
    }
  }

  GetItemFormData() {
    this.submenuForm.patchValue({
      description: this.data.description || '',
      icon: this.data.icon || '',
      class: this.data.class || '',
      routes: this.data.routes || '',
      sort: this.data.sort || 1,
      status: this.data.status || 'A',
      transNo: this.data.transNo || this.transNo
    });
  }
  saveSubmenus(): void {
    if (this.submenuForm.invalid) {
      this.alert.toastrError("Form is invalid!");
      this.submenuForm.markAllAsTouched();
      return;
    }

    const data = this.submenuForm.value;

    this.submenuService.updateSubmenu(this.data.id, data).subscribe({
      next: (res: any) => {
        if (res?.success) {
          this.alert.toastrSuccess(res.message || 'Updated successfully');
          this.dialogRef.close(true);  // close dialog and refresh parent
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
    this.submenuForm.reset({
      transNo: this.transNo,
      description: '',
      icon: '',
      class: '',
      routes: '',
      sort: null,
      status: ''
    });
  }
}
