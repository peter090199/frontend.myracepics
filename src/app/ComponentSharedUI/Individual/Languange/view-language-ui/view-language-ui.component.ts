import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/services/Global/notifications.service';
import { ProfessionalService } from 'src/app/services/SharedServices/professional.service';
import { AddEditLanguageComponent } from '../../ProfessionalDev/Edit/add-edit-language/add-edit-language.component';
import { MatDialog } from '@angular/material/dialog';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';
@Component({
  selector: 'app-view-language-ui',
  templateUrl: './view-language-ui.component.html',
  styleUrls: ['./view-language-ui.component.css']
})
export class ViewLanguageUIComponent implements OnInit {

  constructor(private language: ProfessionalService,
    private alert: NotificationsService, private dialog: MatDialog,
    private languageService: CurriculumVitaeService
  ) { }

  formLanguage: any = [];
  ngOnInit(): void {
    this.loadData();

  }
  loadData() {
    this.languageService.getLanguages().subscribe({
      next: (res) => {
        if (res.success == true) {
          this.formLanguage = res.languages;
        } else {
          this.alert.toastrWarning(res.message);
        }
      }, 
      error: (err) => {
      //  console.error('API error:', err);
      },
    });
  }
  isDeleting = false;

removelanguage(id: number): void {
  if (!confirm('Are you sure you want to delete this language?')) return;

  this.isDeleting = true;

  this.languageService.deleteLanguage(id).subscribe({
    next: () => {
      this.formLanguage = this.formLanguage.filter((lang: { id: number; }) => lang.id !== id);
      this.isDeleting = false;
    },
    error: err => {
      console.error('Failed to delete language:', err);
      this.isDeleting = false;
    }
  });
}

  removelanguagexx(id: number) {
    console.log(id)
        this.languageService.deleteLanguage(id).subscribe({
      next: (res) => {
        if (res.success == true) {
          this.alert.toastrSuccess(res.message);
          this.loadData();
        } else {
          this.alert.toastrWarning(res.message);
        }
      }, 
      error: (err) => {
      //  console.error('API error:', err);
      },
    });
    // this.alert.toastrSuccess("Successfuly Deleted!")
    // this.formLanguage.splice(index, 1);
  }


  editLanguage(index: number): void {
    const Edit = this.formLanguage[index];
    const dialogRef = this.dialog.open(AddEditLanguageComponent, {
      width: '500px',
      data: Edit
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }
}
