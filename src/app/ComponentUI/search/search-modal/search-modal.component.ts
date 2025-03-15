// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-search-modal',
//   templateUrl: './search-modal.component.html',
//   styleUrls: ['./search-modal.component.css']
// })
// export class SearchModalComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }



import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-search-modal',
    templateUrl: './search-modal.component.html',
    styleUrls: ['./search-modal.component.css']
  })

export class SearchModalComponent {
  constructor(
    public dialogRef: MatDialogRef<SearchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public user: any
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }
}
