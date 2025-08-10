import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CurriculumVitaeService } from 'src/app/services/CV/curriculum-vitae.service';
import { ToolBoxService } from 'src/app/services/Global/tool-box.service';

@Component({
  selector: 'app-print-cv',
  templateUrl: './print-cv.component.html',
  styleUrls: ['./print-cv.component.css']
})
export class PrintCVComponent implements OnInit {
  cvData: any = []; 
  error: string | null = null;
  @ViewChild('printContent') printContent!: ElementRef;
  
  Title: string = '';
  Transaction: string = '';

  constructor(
    private cvService: CurriculumVitaeService,
    private toolBoxService: ToolBoxService,
    private router: Router,  private dialogRef: MatDialogRef<PrintCVComponent>
  ) { }

  ngOnInit(): void {
    this.getCVData();
  }

  getCVData(): void {
    this.cvService.getProfileCV().subscribe(
      (response) => {
        if (response?.success && Array.isArray(response.message)) {
          this.cvData = response.message;
          // Save to localStorage for print popup use
          localStorage.setItem('Headers', JSON.stringify(this.cvData));
          localStorage.setItem('Transaction', 'items');
        } else {
          this.error = 'Invalid response format.';
          this.loadFromLocalStorage();
        }
      },
      (error) => {
        this.error = 'Error fetching CV data.';
        console.error('Error fetching CV data:', error);
        this.loadFromLocalStorage();
      }
    );
  }

  loadFromLocalStorage(): void {
    const savedData = localStorage.getItem('Headers');
    if (savedData) {
      this.cvData = JSON.parse(savedData);
      this.Transaction = localStorage.getItem('Transaction') || '';
    }
  }

  printData(): void {
    window.print();
   //  this.onClickPrintReceipts()
  }

  
proceed(): void {
  this.dialogRef.close();
  this.router.navigate(['/home']);
}

  onClickPrintReceipts(): void {
    const url = this.router.serializeUrl(this.router.createUrlTree(['print/printcv']));
    this.popupWindow(url, 'Items', window, 800, 800);
  }

  popupWindow(url: string, windowName: string, win: Window = window, w: number, h: number): Window | null {
    const y = win.screenY + (win.outerHeight - h) / 2;
    const x = win.screenX + (win.outerWidth - w) / 2;
    return win.open(url, windowName, `width=${w}, height=${h}, top=${y}, left=${x}`);
  }
}
