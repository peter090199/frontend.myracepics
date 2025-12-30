import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SecurityRolesService } from 'src/app/services/Security/security-roles.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';

@Component({
  selector: 'app-security-roles-ui',
  templateUrl: './security-roles-ui.component.html',
  styleUrls: ['./security-roles-ui.component.css']
})
export class SecurityRolesUIComponent implements OnInit {

  role_code!: string;
  securityRoles: any[] = [];
  selectedMenus: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private securityService: SecurityRolesService,
    private notify: NotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.role_code = data.rolecode;
  }

  ngOnInit(): void {
    this.getSecurityRoles(this.role_code);
  }

  getSecurityRoles(rolecode: string): void {
    this.loading = true;
    this.securityService.getSecurityRolesByDesc_Code(rolecode).subscribe({
      next: (res: any[]) => {
        this.securityRoles = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load security roles';
        this.loading = false;
      }
    });
  }

  onMenuChange(menu: any, event: MatCheckboxChange): void {
    menu.access = event.checked;

    if (event.checked) {
      let existing = this.selectedMenus.find(m => m.menus_id === menu.menus_id);
      if (!existing) {
        this.selectedMenus.push({
          rolecode: this.role_code,
          menus_id: menu.menus_id,
          checked: true,
          lines: []
        });
      } else {
        existing.checked = true;
      }
    } else {
      const menuObj = this.selectedMenus.find(m => m.menus_id === menu.menus_id);
      if (menuObj) {
        menuObj.checked = false;
        menuObj.lines = [];
      }
    }
    this.logSelectedMenus();
  }

  onSubmenuChange(menu: any, sub: any, event: MatCheckboxChange): void {
    sub.access = event.checked;
    let parent = this.selectedMenus.find(m => m.menus_id === menu.menus_id);

    if (event.checked) {
      if (!parent) {
        parent = {
          rolecode: this.role_code,
          menus_id: menu.menus_id,
          checked: true,
          lines: []
        };
        this.selectedMenus.push(parent);
        menu.access = true;
      }
      const existingSub = parent.lines.find((l: { submenus_id: any; }) => l.submenus_id === sub.submenus_id);
      if (!existingSub) {
        parent.lines.push({ submenus_id: sub.submenus_id, checked: true });
      } else {
        existingSub.checked = true;
      }
    } else {
      if (parent) {
        const subIndex = parent.lines.findIndex((l: { submenus_id: any; }) => l.submenus_id === sub.submenus_id);
        if (subIndex > -1) parent.lines[subIndex].checked = false;

        const anyChecked = parent.lines.some((l: { checked: any; }) => l.checked);
        if (!anyChecked && !parent.checked) {
          this.selectedMenus = this.selectedMenus.filter(m => m.menus_id !== menu.menus_id);
          menu.access = false;
        }
      }
    }

    this.logSelectedMenus();
  }

  private logSelectedMenus(): void {
    console.clear();
    console.log('===== SELECTED MENUS =====');
    this.selectedMenus.forEach(menu => {
      console.group(`Menu ID: ${menu.menus_id} (checked: ${menu.checked})`);
      if (menu.lines.length === 0) {
        console.log('Submenus: NONE');
      } else {
        menu.lines.forEach((sub: { submenus_id: any; checked: any; }) => console.log(`- Submenu ID: ${sub.submenus_id} (checked: ${sub.checked})`));
      }
      console.groupEnd();
    });
    console.log('==========================');
  }
  submitData(): void {
    if (!this.selectedMenus || this.selectedMenus.length === 0) {
      this.notify.toastrError('Please select at least one menu');
      return;
    }

    const payload = {
      header: this.selectedMenus.map(menu => ({
        rolecode: this.role_code,
        menus_id: menu.menus_id,
        checked: !!menu.checked,
        lines: Array.isArray(menu.lines)
          ? menu.lines.map((sub: { submenus_id: any; checked: any; }) => ({
            submenus_id: sub.submenus_id,
            checked: !!sub.checked
          }))
          : []
      }))
    };

    console.log('Payload to send:', payload);

    this.loading = true;

    this.securityService.saveAccessMenu(payload).subscribe({
      next: (res: any) => {
        this.loading = false;

        if (res?.success) {
          this.notify.toastrSuccess(res.message || 'Saved successfully');
        } else {
          this.notify.toastrError(res?.message || 'Save failed');
        }
      },
      error: (err) => {
        console.error('Save error:', err);
        this.loading = false;
        this.notify.toastrError('Submission failed');
      }
    });
  }
}
// import { Component, Inject, OnInit } from '@angular/core';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { MatCheckboxChange } from '@angular/material/checkbox';
// import { SecurityRolesService } from 'src/app/services/Security/security-roles.service';
// import { NotificationsService } from 'src/app/services/Global/notifications.service';

// interface Submenu {
//   submenus_id: number;
//   checked: boolean;
// }

// interface Menu {
//   rolecode: string;
//   menus_id: number;
//   checked: boolean;
//   lines: Submenu[];
// }

// interface HeaderData {
//   header: Menu[];
// }

// @Component({
//   selector: 'app-security-roles-ui',
//   templateUrl: './security-roles-ui.component.html',
//   styleUrls: ['./security-roles-ui.component.css']
// })
// export class SecurityRolesUIComponent implements OnInit {
//   data: HeaderData = {
//     header: [
//       {
//         rolecode: 'DEF-ADMIN',
//         menus_id: 2,
//         checked: true,
//         lines: [
//           { submenus_id: 2, checked: true },
//           { submenus_id: 1, checked: false }
//         ]
//       },
//       {
//         rolecode: 'DEF-ADMIN',
//         menus_id: 6,
//         checked: true,
//         lines: []
//       }
//     ]
//   };

//   role_code:any[]=[];

//   constructor(
//     private securityService: SecurityRolesService,
//     private notify: NotificationsService,
//     @Inject(MAT_DIALOG_DATA) public data2: any
//   ) {
//     this.role_code = data2.rolecode;
//   }
//   ngOnInit(): void {
//     // Optional: Initialize or fetch data here
//   }

//   // When menu checkbox changes
//   onMenuChange(menu: Menu) {
//     if (menu.lines && menu.lines.length > 0) {
//       menu.lines.forEach(sub => sub.checked = menu.checked);
//     }
//     console.log('Menu updated:', menu);
//   }

//   // When submenu checkbox changes
//   onSubmenuChange(menu: Menu, sub: Submenu) {
//     if (menu.lines && menu.lines.length > 0) {
//       // If all submenus are checked, menu.checked becomes true
//       menu.checked = menu.lines.every(s => s.checked);
//     }
//     console.log('Submenu updated:', sub);
//   }


//    saveData() {

//     console.log(this.data)
//     this.securityService.saveAccessMenu(this.data).subscribe({
//       next: res => console.log('Saved successfully', res),
//       error: err => console.error('Error saving data', err)
//     });
//   }


//}
