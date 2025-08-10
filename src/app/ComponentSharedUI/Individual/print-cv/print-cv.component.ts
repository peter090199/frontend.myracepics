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
    private router: Router, private dialogRef: MatDialogRef<PrintCVComponent>
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

  printData2(): void {
    this.onClickPrintReceipts()
  }

  printData(): void {
  const printContents = document.getElementById('print-content')?.innerHTML;
  if (!printContents) return;

  const popupWin = window.open('', '_blank', 'width=800,height=900,scrollbars=no,resizable=no');
  if (!popupWin) return;

  popupWin.document.open();
  popupWin.document.write(`
    <html>
      <head>
        <title>PrintCV</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px;}
          h2 { color: #333; }
          .logo img { width: 100%; height: 100px; object-fit: contain; }
          .logos img { width: 2in; height: 2in; object-fit: cover; }
          .logo { width: 100%; height: 100px; }
          .cv-header { width: 100%; display: flex; justify-content: center; background-color: white; }
          .cv-header .logo { width: 100%; }
          .cv-header .logo img { width: 100%; height: auto; object-fit: contain; }
          .data-item { display: flex; justify-content: space-between; font-family: Verdana, sans-serif; font-size: 16px; margin-bottom: 1px; }
          .label { font-weight: bold; text-align: left; color: #808080; width: 190px; }
          .value { text-align: left; flex: 1; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-right: auto; }
          .header img { width: 150px; height: 150px; border-radius: 8px; object-fit: cover; }
          .header-content { display: flex; flex-direction: column; }
          .header-content p { margin: 2px 0; font-size: 16px; }
          .header-content strong { text-transform: uppercase; }
          .cv-section h2 {font-size: 20px;font-weight: 600;margin-top: 20px;margin-bottom: 10px;padding-bottom: 4px; border-bottom: 2px solid #ccc;color: #444;
  }

        </style>
      </head>
      <body onload="window.print();window.close()">
        ${printContents}
      </body>
    </html>
  `);
  popupWin.document.close();
}


  // printData(): void {
  //   let printContents = document.getElementById('print-content')?.innerHTML;
  //   if (!printContents) return;

  //   let popupWin = window.open('', 'PrintCV', 'width=600,height=800');
  //   popupWin?.document.open();
  //   popupWin?.document.write(`
  //   <html>
  //     <head>
  //       <title>Print Preview</title>
  //       <style>
  //         body { 
  //         font-family: Arial, sans-serif; padding: 20px; }
  //         h2 {color: #333; 
  //           }   
  //           .logo img {
  //             width: 100%;
  //             height: 100px;
  //             object-fit: contain;
  //           }

  //           .logos img {
  //             width: 2in; /* 2 inches wide */
  //             height: 2in; /* 2 inches tall */
  //             object-fit: cover; /* Ensures the image fits without distortion */
  //           }

  //           .logo {
  //             width: 100%;
  //             height: 100px;
  //           }
  //           .cv-header {
  //             width: 100%;
  //             display: flex;
  //             justify-content: center; /* Centers logo horizontally */
  //             background-color: white; /* Optional: Set background */
  //           }

  //           .cv-header .logo {
  //             width: 100%; /* Full width container */
  //           }

  //           .cv-header .logo img {
  //             width: 100%; /* Make image span full container width */
  //             height: auto; /* Keep aspect ratio */
  //             object-fit: contain; /* Prevent distortion */
  //           }

  //           /* Data item layout */
  //           .data-item {
  //             display: flex;
  //             justify-content: space-between;
  //             font-family: Verdana, sans-serif;
  //             font-size: 16px;
  //             margin-bottom: 1px;
  //           }

  //           .label {
  //             font-weight: bold;
  //             text-align: left;
  //             color: #808080;
  //             width: 190px; /* Fixed width for alignment */
  //           }

  //           .value {
  //             text-align: left;
  //             flex: 1; /* Let value section expand naturally */
  //           }

  //           /* Header section */
  //           .header {
  //             display: flex;
  //             justify-content: space-between; /* Pushes items left and right */
  //             align-items: flex-start; /* Top alignment */
  //             margin-right: auto;
  //           }

  //           .header img {
  //             width: 150px;
  //             height: 150px;
  //             border-radius: 8px;
  //             object-fit: cover;
  //           }

  //           .header-content {
  //             display: flex;
  //             flex-direction: column;
  //           }

  //           .header-content p {
  //             margin: 2px 0; /* Fixed margin shorthand */
  //             font-size: 16px;
  //           }

  //           .header-content strong {
  //             text-transform: uppercase;
  //           }

  //       </style>
  //     </head>
  //     <body onload="window.print();window.close()">
  //       ${printContents}
  //     </body>
  //   </html>
  // `);
  //   popupWin?.document.close();
  // }



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
