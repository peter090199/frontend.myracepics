import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    const allowedRoles = route.data['roles'] as string[];
    const userRole = sessionStorage.getItem('role'); // runner | admin | masteradmin | photographer

    // ❌ Not logged in
    if (!userRole) {
      return this.router.parseUrl('/createaccount');
    }

    // ✅ Role allowed
    if (allowedRoles && allowedRoles.includes(userRole)) {
      return true;
    }

    // ❌ Role not allowed → redirect
    return this.redirectByRole(userRole);
  }

  private redirectByRole(role: string): UrlTree {
    switch (role) {

      case 'photographer':
        return this.router.parseUrl('/photographer');

      case 'admin':
        return this.router.parseUrl('/admin/admin-dashboard');

      case 'masteradmin':
        return this.router.parseUrl('/masteradmin/admin-dashboard');

      case 'runner':
        return this.router.parseUrl('/runner');

      default:
        return this.router.parseUrl('/homepage');
    }
  }
}
