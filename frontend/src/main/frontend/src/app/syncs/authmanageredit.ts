/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthManagerSyncsEdit implements CanActivate {

    constructor(public router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (window.localStorage.getItem('authenticated') == "Sim" && (
            window.localStorage.getItem('ROLE_ODMA') ||
            window.localStorage.getItem('ROLE_ORMA')||
            window.localStorage.getItem('ROLE_SIS'))) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}