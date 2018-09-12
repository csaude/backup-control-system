/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
@Injectable()
export class AuthManagerSendsEdit implements CanActivate {

    constructor(public router: Router) { }

    canActivate() {

        if (window.sessionStorage.getItem('authenticated') == "Sim" && (
            window.sessionStorage.getItem('ROLE_GDD') ||
            window.sessionStorage.getItem('ROLE_ODMA') ||
            window.sessionStorage.getItem('ROLE_ORMA')||
            window.sessionStorage.getItem('ROLE_SIS'))) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}