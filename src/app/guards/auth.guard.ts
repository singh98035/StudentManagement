import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DbService } from '../services/db.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private db: DbService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if(!this.db.userLoggedIn) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
    return true;
  }
  
}
