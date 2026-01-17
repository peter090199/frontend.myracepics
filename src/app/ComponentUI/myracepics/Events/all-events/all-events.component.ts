// import { Component, OnInit } from '@angular/core';
// import { EventsService } from 'src/app/services/myracepics/MyEvents/events.service';

// interface Event {
//   title: string;
//   location: string;
//   date: string; // YYYY-MM-DD
//   status: 'Upcoming' | 'Running' | 'Completed';
//   image: string;
//   imageLoaded?: boolean; // ✅ track if image has loaded
// }

// @Component({
//   selector: 'app-all-events',
//   templateUrl: './all-events.component.html',
//   styleUrls: ['./all-events.component.css']
// })
// export class AllEventsComponent implements OnInit {
//  constructor(private eventService: EventsService


//  ) { }

//   events: any[] = [];
//   filteredEvents: any[] = [];
//   eventSearch: string = '';
//   selectedTab: number = 0; // 0=All,1=Upcoming,2=Completed
//   fromDate: Date | null = null;
//   toDate: Date | null = null;
//   loading: boolean = true;
//   nav_module: any = [];

//   ngOnInit(): void {

//       this.loadEvents();
//     setTimeout(() => {
//       this.filteredEvents = [...this.events];
//       this.loading = false;
//     }, 1500);



//   }

//   loadEvents() {
//     this.eventService.getevents().subscribe({
//       next: (res) => {

//         this.events = res.events.map((e: { image: any; }) => ({
//           ...e,
//           image: JSON.parse(e.image)
//         }));

//           this.filteredEvents = [...this.events];
//         console.log(this.events);
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error(err);
//         this.loading = false;
//       }
//     });
//   }



//   filterEvents() {
//     const search = this.eventSearch.toLowerCase();

//     this.filteredEvents = this.events.filter(event => {
//       const eventDate = new Date(event.date);

//       // 🔹 Tab filter
//       const matchesTab =
//         this.selectedTab === 0 ? true :
//           this.selectedTab === 1 ? event.status === 'Upcoming' || event.status === 'Running' :
//             event.status === 'Completed';

//       // 🔹 Search filter
//       const matchesSearch = event.title.toLowerCase().includes(search);

//       // 🔹 Date range filter
//       let matchesDate = true;
//       if (this.fromDate && eventDate < this.stripTime(this.fromDate)) matchesDate = false;
//       if (this.toDate && eventDate > this.stripTime(this.toDate)) matchesDate = false;

//       return matchesTab && matchesSearch && matchesDate;
//     });
//   }

//   // Remove time for accurate date comparison
//   stripTime(date: Date): Date {
//     return new Date(date.getFullYear(), date.getMonth(), date.getDate());
//   }

//   clearSearch() {
//     this.eventSearch = '';
//     this.filterEvents();
//   }

//   clearDates() {
//     this.fromDate = null;
//     this.toDate = null;
//     this.filterEvents();
//   }

//   onTabChange() {
//     this.filterEvents();
//   }

//   viewPhotos(event: Event) {
//     console.log('Viewing photos for:', event.title);
//   }

//   shareEvent(event: Event) {
//     console.log('Sharing event:', event.title);
//   }

//   // ✅ Called when an image finishes loading
//   onImageLoad(event: Event) {
//     event.imageLoaded = true;
//   }

// }


import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/myracepics/MyEvents/events.service';

interface Event {
  id: number;
  title: string;
  location: string;
  date: string; // YYYY-MM-DD
  status: 'Upcoming' | 'Running' | 'Completed';
  image: string[]; // array of image URLs
  imageLoaded?: boolean[]; // track if each image has loaded
}

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css']
})
export class AllEventsComponent implements OnInit {

  events: any[] = [];
  filteredEvents: any = [];
  eventSearch: string = '';
  selectedTab: number = 0; // 0=All,1=Upcoming/Running,2=Completed
  fromDate: Date | null = null;
  toDate: Date | null = null;
  loading: boolean = true;
  nav_module: any = [];

  constructor(private eventService: EventsService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  
  eventProfileLink(event: any): any[] {
    const role = sessionStorage.getItem('role');

    const roleRouteMap: any = {
      runner: 'runner',
      admin: 'admin',
      masteradmin: 'masteradmin',
      photographer: 'photographer'
    };

    const baseRoute = roleRouteMap[role ?? ''] ?? 'homepage';

    return ['/', baseRoute, 'eventprofile', event.title, event.uuid];
  }



  loadEvents() {
    this.loading = true;

    this.eventService.getevents().subscribe({
      next: (res: { events: any[] }) => {
        this.events = res.events.map((e: any) => {
          // Safely parse image array
          let images: string[] = [];
          try {
            images = Array.isArray(e.image) ? e.image : JSON.parse(e.image || '[]');
            // Prepend backend URL if not already full URL
            images = images.map((img: string) => img.startsWith('http') ? img : `http://localhost:8000/${img}`);
          } catch (err) {
            console.error('Error parsing images for event:', e, err);
          }

          return {
            ...e,
            uuid: e.uuid,
            title: e.title,
            location: e.location,
            category: e.category,
            image: images,
            imageLoaded: new Array(images.length).fill(false) // track each image load
          };
        });

        this.filteredEvents = [...this.events];
        console.log('[AllEventsComponent] Loaded events:', this.events);
        this.loading = false;
      },
      error: (err) => {
        console.error('[AllEventsComponent] Error loading events:', err);
        this.loading = false;
      }
    });
  }

  filterEvents() {
    const search = this.eventSearch.toLowerCase();

    this.filteredEvents = this.events.filter(event => {
      const eventDate = new Date(event.date);

      // 🔹 Tab filter
      const matchesTab =
        this.selectedTab === 0 ? true :
          this.selectedTab === 1 ? (event.status === 'Upcoming' || event.status === 'Running') :
            event.status === 'Completed';

      // 🔹 Search filter (safe check)
      const matchesSearch = event.title?.toLowerCase().includes(search) ?? false;

      // 🔹 Date range filter
      let matchesDate = true;
      if (this.fromDate && eventDate < this.stripTime(this.fromDate)) matchesDate = false;
      if (this.toDate && eventDate > this.stripTime(this.toDate)) matchesDate = false;

      return matchesTab && matchesSearch && matchesDate;
    });
  }


  // Remove time for accurate date comparison
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

  viewPhotos(event: Event) {
    console.log('Viewing photos for:', event.title);
    // You can implement a modal or router navigation here
  }

  shareEvent(event: Event) {
    console.log('Sharing event:', event.title);
    // Implement share logic here
  }
  getCategoryIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'fun run':
        return 'directions_run'; // Material icon for running
      case 'upcoming':
        return 'schedule'; // clock icon
      case 'completed':
        return 'check_circle'; // completed
      case 'canceled':
        return 'cancel'; // canceled
      default:
        return 'event'; // default calendar icon
    }
  }

  getCategoryClass(category: string): string {
    switch (category.toLowerCase()) {
      case 'running':
        return 'badge-running';
      case 'upcoming':
        return 'badge-upcoming';
      case 'completed':
        return 'badge-completed';
      case 'canceled':
        return 'badge-canceled';
      default:
        return 'badge-default';
    }
  }

  // ✅ Called when an image finishes loading
  onImageLoad(event: Event, index: number) {
    if (!event.imageLoaded) event.imageLoaded = [];
    event.imageLoaded[index] = true;
  }
  // Check if all images in this event are loaded
  // eventLoaded(event: Event): boolean {
  //   return event.imageLoaded?.every(loaded => loaded) ?? false;
  // }

}
