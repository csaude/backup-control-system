/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
@Injectable()
export class AuthManagerIronkeysEdit implements CanActivate {

  //-------------------------------------------------
  //Constructors
  //-------------------------------------------------
    constructor(public router: Router) { }

    canActivate() {
        if (window.sessionStorage.getItem('authenticated') == "Sim" && (window.sessionStorage.getItem('ROLE_SIS') || window.sessionStorage.getItem('ROLE_IT'))) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}