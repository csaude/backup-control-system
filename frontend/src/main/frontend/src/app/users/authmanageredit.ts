/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
@Injectable()
export class AuthManagerUsersEdit implements CanActivate {

  //-------------------------------------------------
  //Constructors
  //-------------------------------------------------
    constructor(public router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (window.sessionStorage.getItem('authenticated') == "Sim" && (
            window.sessionStorage.getItem('ROLE_SIS'))
        ) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }

    }

}