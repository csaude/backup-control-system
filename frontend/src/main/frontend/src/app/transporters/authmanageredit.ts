
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
@Injectable()
export class AuthManagerTransportersEdit implements CanActivate {

  constructor(public router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (window.sessionStorage.getItem('authenticated') == "Sim" && (
            window.sessionStorage.getItem('ROLE_SIS') ||
            window.sessionStorage.getItem('ROLE_ODMA') ||
            window.sessionStorage.getItem('ROLE_GDD') ||
            window.sessionStorage.getItem('ROLE_ORMA'))
        ) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}