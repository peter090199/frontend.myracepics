import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Define your route interface (no @Injectable needed)
export interface NavRoute {
  requiresAuth: any;
  path: string;
  component?: string;
  children?: NavRoute[];
  canActivate?: boolean;
}

// Injectable service
@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor() { }

  // Example method to get routes (can be replaced with HTTP call)
  getNavigation(): Observable<NavRoute[]> {
    // Return an empty array or static routes as example
    return of([]);
  }
}
