/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
*/

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthManagerReceivesRead implements CanActivate {

    constructor(public router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (window.localStorage.getItem('authenticated') == "Sim"&& (window.localStorage.getItem('ROLE_SIS')||window.localStorage.getItem('ROLE_GMA')||window.localStorage.getItem('ROLE_OA'))) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }

    }

}