import { Component, OnInit } from '@angular/core';

interface Event {
  title: string;
  location: string;
  date: string; // YYYY-MM-DD
  status: 'Upcoming' | 'Running' | 'Completed';
  image: string;
}

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {

  events: Event[] = [
    { title: 'DBTC Fun Run', location: 'Don Bosco Technical College', date: '2026-01-10', status: 'Running', image: 'assets/logo.jpg' },
    { title: 'Cebu Marathon 2026', location: 'SM Seaside City Cebu', date: '2026-01-11', status: 'Running', image: 'assets/logo.jpg' },
    { title: 'Mactan Island Triathlon', location: 'Mactan Island', date: '2026-02-05', status: 'Upcoming', image: 'assets/logo.jpg' },
    { title: 'Ayala Fun Run', location: 'Ayala Center Cebu', date: '2026-03-10', status: 'Upcoming', image: 'assets/logo.jpg' },
    { title: 'Cebu City Marathon', location: 'Cebu City Sports Complex', date: '2025-12-21', status: 'Completed', image: 'assets/logo.jpg' },
    { title: 'Ayala Fun Run', location: 'Ayala Center Cebu', date: '2026-03-10', status: 'Upcoming', image: 'assets/logo.jpg' },
    { title: 'Cebu City Marathon', location: 'Cebu City Sports Complex', date: '2025-12-21', status: 'Completed', image: 'assets/logo.jpg' },
    { title: 'Ayala Fun Run', location: 'Ayala Center Cebu', date: '2026-03-10', status: 'Upcoming', image: 'assets/logo.jpg' },
    { title: 'Cebu City Marathon', location: 'Cebu City Sports Complex', date: '2025-12-21', status: 'Completed', image: 'assets/logo.jpg' },
    { title: 'Ayala Fun Run', location: 'Ayala Center Cebu', date: '2026-03-10', status: 'Upcoming', image: 'assets/logo.jpg' },
    { title: 'Cebu City Marathon', location: 'Cebu City Sports Complex', date: '2025-12-21', status: 'Completed', image: 'assets/logo.jpg' },
    { title: 'Ayala Fun Run', location: 'Ayala Center Cebu', date: '2026-03-10', status: 'Upcoming', image: 'assets/logo.jpg' },
    { title: 'Cebu City Marathon', location: 'Cebu City Sports Complex', date: '2025-12-21', status: 'Completed', image: 'assets/logo.jpg' },
    { title: 'Ayala Fun Run', location: 'Ayala Center Cebu', date: '2026-03-10', status: 'Upcoming', image: 'assets/logo.jpg' },
    { title: 'Cebu City Marathon', location: 'Cebu City Sports Complex', date: '2025-12-21', status: 'Completed', image: 'assets/logo.jpg' },
    { title: 'Ayala Fun Run', location: 'Ayala Center Cebu', date: '2026-03-10', status: 'Upcoming', image: 'assets/logo.jpg' },
    { title: 'Cebu City Marathon', location: 'Cebu City Sports Complex', date: '2025-12-21', status: 'Completed', image: 'assets/logo.jpg' }

  ];

  filteredEvents: Event[] = [];

  eventSearch: string = '';
  selectedTab: number = 0; // 0=All,1=Upcoming,2=Completed

  // ✅ Date range
  fromDate: Date | null = null;
  toDate: Date | null = null;
  loading: boolean = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.filteredEvents = [...this.events];
      this.loading = false;
    }, 1500);
  }

  filterEvents() {
    const search = this.eventSearch.toLowerCase();

    this.filteredEvents = this.events.filter(event => {
      const eventDate = new Date(event.date);

      // 🔹 Tab filter
      const matchesTab =
        this.selectedTab === 0 ? true :
          this.selectedTab === 1 ? event.status === 'Upcoming' || event.status === 'Running' :
            event.status === 'Completed';

      // 🔹 Search filter
      const matchesSearch = event.title.toLowerCase().includes(search);

      // 🔹 Date range filter
      let matchesDate = true;

      if (this.fromDate && eventDate < this.stripTime(this.fromDate)) {
        matchesDate = false;
      }

      if (this.toDate && eventDate > this.stripTime(this.toDate)) {
        matchesDate = false;
      }

      return matchesTab && matchesSearch && matchesDate;
    });
  }

  // Remove time for accurate comparison
  stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  clearSearch() {
    this.eventSearch = '';
    this.filterEvents();
  }

  clearDates() {
    this.fromDate = null;
    this.toDate = null;
    this.filterEvents();
  }

  onTabChange() {
    this.filterEvents();
  }

  viewPhotos(event: any) {
    console.log('Viewing photos for:', event.title);
  }

  shareEvent(event: Event) {
    console.log('Sharing event:', event.title);
  }
}
