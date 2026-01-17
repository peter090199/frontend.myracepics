import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/myracepics/MyEvents/events.service';

interface Event {
  id: number;
  uuid: string;
  title: string;
  location: string;
  date: string; // YYYY-MM-DD
  status: 'Upcoming' | 'Running' | 'Completed';
  category: string;
  image: string[];

  imageLoaded: boolean[];

  // 🔥 Load-more support
  visibleImages: number;
  imagesPerLoad: number;
}

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrls: ['./all-events.component.css']
})
export class AllEventsComponent implements OnInit {

  events: Event[] = [];
  filteredEvents: Event[] = [];

  eventSearch = '';
  selectedTab = 0;
  fromDate: Date | null = null;
  toDate: Date | null = null;
  loading = true;

  constructor(private eventService: EventsService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  /* ===================== LOAD EVENTS ===================== */
  loadEvents() {
    this.loading = true;

    this.eventService.getevents().subscribe({
      next: (res: { events: any[] }) => {
        this.events = res.events.map(e => {
          const images = this.parseImages(e.image);

          return {
            ...e,
            image: images,
            imageLoaded: new Array(images.length).fill(false),
            visibleImages: 3,
            imagesPerLoad: 3
          };

      });

    this.filteredEvents = [...this.events];
    this.loading = false;
  },
  error: err => {
  console.error('Error loading events', err);
  this.loading = false;
}
    });
  }

/* ===================== IMAGE HELPERS ===================== */
parseImages(imageField: any): string[] {
  try {
    const images: string[] = Array.isArray(imageField)
      ? imageField
      : JSON.parse(imageField || '[]');

    return images.map(img =>
      img.startsWith('http')
        ? img
        : `https://backend.myracepics.com/${encodeURIComponent(img)}`
    );
  } catch {
    return [];
  }
}

onImageLoad(event: Event, index: number) {
  if (!event.imageLoaded) {
    event.imageLoaded = new Array(event.image.length).fill(false);
  }
  event.imageLoaded[index] = true;
}

allImagesLoaded(event: Event): boolean {
  return event.imageLoaded?.every(v => v) ?? false;
}

/* ===================== LOAD MORE ===================== */
loadMoreImages(event: any) {
  if (!event.visibleImages || !event.imagesPerLoad) return;

  event.visibleImages = Math.min(
    event.visibleImages + event.imagesPerLoad,
    event.image.length
  );
}

hasMoreImages(event: Event): boolean {
  return (event.visibleImages ?? 0) < event.image.length;
}

/* ===================== FILTERING ===================== */
filterEvents() {
  const search = this.eventSearch.toLowerCase();

  this.filteredEvents = this.events.filter(event => {
    const eventDate = this.stripTime(new Date(event.date));

    const matchesTab =
      this.selectedTab === 0 ||
      (this.selectedTab === 1 &&
        (event.status === 'Upcoming' || event.status === 'Running')) ||
      (this.selectedTab === 2 && event.status === 'Completed');

    const matchesSearch = event.title?.toLowerCase().includes(search);

    let matchesDate = true;
    if (this.fromDate && eventDate < this.stripTime(this.fromDate)) matchesDate = false;
    if (this.toDate && eventDate > this.stripTime(this.toDate)) matchesDate = false;

    return matchesTab && matchesSearch && matchesDate;
  });
}

stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

clearSearch() {
  this.eventSearch = '';
  this.filterEvents();
}

onTabChange(tabIndex: number) {
  this.selectedTab = tabIndex;
  this.filterEvents();
}

/* ===================== ROUTING ===================== */
eventProfileLink(event: Event): any[] {
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
}
