import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-all-suggestions-modal',
  templateUrl: './all-suggestions-modal.component.html',
  styleUrls: ['./all-suggestions-modal.component.css']
})
export class AllSuggestionsModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { people: any[] }) {}

  ngOnInit(): void {
  }

}
