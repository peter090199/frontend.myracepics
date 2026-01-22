import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-mobile-filter-dialog',
  templateUrl: './mobile-filter-dialog.component.html',
  styleUrls: ['./mobile-filter-dialog.component.css']
})
export class MobileFilterDialogComponent {
  eventSearch: string = '';
  fromDate: Date | null = null;
  toDate: Date | null = null;
  private searchSubject: Subject<string> = new Subject();
  @Output() filtersChanged = new EventEmitter<any>();


  constructor(public dialogRef: MatDialogRef<MobileFilterDialogComponent>) {

  }

    onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  close() {
    this.dialogRef.close();
  }

  
  clearSearch() {
    this.eventSearch = '';
    this.applyFilters();
  }

  applyFilters() {
    this.filtersChanged.emit({
      search: this.eventSearch,
      from: this.fromDate,
      to: this.toDate
    });
  }
}
