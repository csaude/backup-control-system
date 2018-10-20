/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';

/** 
* @author Damasceno Lopes
*/
@Injectable()
export class AuthManagerSendsRead implements CanActivate {

   constructor(public router: Router) { }

    canActivate() {
        if (window.sessionStorage.getItem('authenticated') == "Sim") {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}