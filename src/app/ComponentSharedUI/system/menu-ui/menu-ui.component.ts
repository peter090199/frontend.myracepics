// import { Component, Inject, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { NotificationsService } from 'src/app/services/Global/notifications.service';
// import { MenuService } from 'src/app/services/MasterAdmin/menu.service';
// @Component({
//   selector: 'app-menu-ui',
//   templateUrl: './menu-ui.component.html',
//   styleUrls: ['./menu-ui.component.css']
// })
// export class MenuUIComponent implements OnInit {
//   menuForm!: FormGroup;
//   btnSave: string = 'Save';

//   constructor(
//     private fb: FormBuilder,
//     public dialogRef: MatDialogRef<MenuUIComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private alert: NotificationsService, private menuService: MenuService
//   ) {
//     this.menuForm = this.fb.group({
//       desc_code: ['top_navigation', [Validators.required]],
//       description: ['', [Validators.required]],
//       icon: ['-', [Validators.required]],
//       class: ['-', [Validators.required]],
//       routes: ['', [Validators.required]],
//       sort: ['', [Validators.required, Validators.min(1)]],
//       status: ['A', [Validators.required]], // Default to Active
//      // lines: this.fb.array([])
//     });
//   }

//   ngOnInit(): void {
//     // const lines = this.menuForm.get('lines') as FormArray;
//     // lines.push(this.createSubmenu());

//     // If editing, change the button text
//     if (this.data) {
//       this.btnSave = 'Update';
//     }
//   }

//   get lines(): FormArray {
//     return this.menuForm.get('lines') as FormArray;
//   }

//   // createSubmenu(): FormGroup {
//   //   return this.fb.group({
//   //     description: [''],
//   //     icon: [''],
//   //     class: [''],
//   //     routes: [''],
//   //     sort: ['', [Validators.min(1)]],
//   //     status: [''] // Default to Active
//   //   });
//   // }

//   // addSubmenu(): void {
//   //   this.lines.push(this.createSubmenu());
//   // }

//   removeSubmenu(index: number): void {
//     if (this.lines.length > 1) {
//       this.lines.removeAt(index);
//     }
//   }

//   onSubmit(): void {
//     if (this.menuForm.invalid) {
//       this.alert.toastrError("Form is invalid!");
//       this.menuForm.markAllAsTouched();
//       return;
//     }
//     const data = this.menuForm.value;
//     console.log(data)
//     return;
//     this.menuService.saveMenu(data).subscribe({
//       next: (res: any) => {
//         if (res?.success) {
//           this.alert.toastrSuccess(res.message || 'Saved successfully');
//           this.dialogRef.close(true); 
//           //   this.resetForm();            // reset form if needed
//         } else {
//           this.alert.toastrWarning(res.message || 'Something went wrong');
//         }
//       },
//       error: () => {
//         this.alert.toastrError('Server error. Please try again.');
//       }
//     });
//   }




//   onSubmitx(): void {
//     if (this.menuForm.valid) {


//       this.dialogRef.close(this.menuForm.value);
//     }
//   }


//   // onSubmitxx(): void {
//   //   if (this.menuForm.valid) {
//   //   const menu = this.menuForm.getRawValue(); 
//   //  //   this.loading = true;

//   //     if(this.btnSave === "Save") 
//   //     {
//   //       this.menuService.postData(menu).subscribe({
//   //         next: (res) => {
//   //         if(res.success === true)
//   //         {
//   //           this.notificationService.toastrSuccess(res.message);
//   //          // this.ResetForm();
//   //         //  this.loading = false;
//   //         }
//   //         else{
//   //           this.notificationService.toastrError(res.message);
//   //         //  this.loading = false; 
//   //         }

//   //         },
//   //         error: (error) => {
//   //        //   this.success = false;
//   //           this.notificationService.toastrError(error.error);
//   //       //    this.loading = false; 
//   //           // Set loading to false in case of error
//   //         },
//   //       });
//   //     }
//   // else if (this.btnSave === 'Update') {
//   //   this.roleService.putData(this.data.id, role).subscribe({
//   //     next: (res) => {
//   //       if(res.success === true)
//   //         {
//   //           this.notificationService.toastrSuccess(res.message);
//   //           this.ResetForm();
//   //           this.loading = true;
//   //         }
//   //         else{
//   //           this.notificationService.toastrWarning(res.message);
//   //           this.loading = false; 
//   //         }

//   //     },
//   //     error: (err) => {
//   //       this.notificationService.toastrWarning(err.error);
//   //       this.loading = false;  // Set loading to false in case of error
//   //     },
//   //   });
//   // }
//   // } else {
//   //   this.notificationService.toastrError("Please fill in the required fields.");
//   // }
//   //}

// }



import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { MenuService } from 'src/app/services/MasterAdmin/menu.service';
@Component({
  selector: 'app-menu-ui',
  templateUrl: './menu-ui.component.html',
  styleUrls: ['./menu-ui.component.css']
})
export class MenuUIComponent {
  menuForm: FormGroup;
  btnSave: string = 'Save';

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    public dialogRef: MatDialogRef<MenuUIComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private alert: NotificationsService
  ) {
    this.menuForm = this.fb.group({
      desc_code: ['top_navigation', Validators.required],
      description: ['', Validators.required],
      icon: ['', Validators.required],
      class: ['', Validators.required],
      routes: ['', Validators.required],
      sort: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      status: ['A', Validators.required]  // default Active
    });

    if (data && data.menu) {
      this.btnSave = 'Update';
      this.menuForm.patchValue(data.menu);
    }
  }

  onSubmit(): void {
    if (this.menuForm.invalid) {
      this.menuForm.markAllAsTouched();
      return;
    }

    console.log(this.menuForm.value)
    // return;
    this.menuService.saveMenu(this.menuForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.alert.toastrSuccess(res.message || 'Saved successfully');
          this.dialogRef.close(true);
        } else {
          this.alert.toastrWarning(res.message || 'Menus Duplicate.');
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Error saving menu');
      }
    });
  }

  onClose(): void {
    this.dialogRef.close(false);
  }
}

