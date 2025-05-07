import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChangePasswordComponent } from 'src/app/ComponentSharedUI/forgot-password-ui/ChangePassword/change-password.component';
import { ForgotPasswordUIComponent } from 'src/app/ComponentSharedUI/forgot-password-ui/forgot-password-ui.component';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/Global/notifications.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  users:any = [];
  isLoading:boolean = false;

  constructor(private user:AuthService,private alert:NotificationsService,
               public dialog:MatDialog

  ) { }
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;

  ngOnInit(): void {
   this.getUserAccounts();
  }

  getUserAccounts(){
    this.isLoading = true;
    this.user.getData().subscribe({
      next: (res) => {
        this.users = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user:', err);
        this.alert.toastrInfo('Error loading user:');
      }
    });
  }



  Changepassword(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
  
    const dialogRef = this.dialog.open(ChangePasswordComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
         this.getUserAccounts(); 
      }
    });
  }
  

  
}
