/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NavbarService } from './nav-bar.service';
import { TranslateService } from 'ng2-translate';
import { ResourcesService } from "./../resources/shared/resources.service";
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

/** 
* @author Damasceno Lopes
*/
export class NavBarComponent implements OnInit {
  public user;
  public ROLE_SIS; ROLE_IT; ROLE_OA; ROLE_GMA; ROLE_ODMA; ROLE_ORMA; ROLE_GDD: string;
  public isAuth: boolean;
  public activeDashboard; activeBackup; activeMetadata; activeUser; activeSync;
  public showNavBar: boolean = false;
  public total; total2;
  public nIntervId; nIntervId2; nIntervId3;

   
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public nav: NavbarService,
    public translate: TranslateService,
    public resourcesService: ResourcesService
  ) {

    translate.addLangs(['pt', 'en']);
    translate.setDefaultLang('pt');
    this.nav.invokeEvent.subscribe(value => {
      if (value === 'someVal') {
        this.callMyMethod();
      }
    });
  }

  /**
   * Call this function on this interval
   */
  callFuntionAtIntervals() {
    clearInterval(this.nIntervId2);
    clearInterval(this.nIntervId3);
    if (this.ROLE_SIS) {
      this.resourcesService.findOneSendByUuidsNotReceivedNum()
        .subscribe(data => {
          this.total = data;
        },
          error => {
            this.total = 0;
          },
          () => {
            if (this.total > 0 && this.nIntervId2 == null) {
              this.nIntervId2 = setInterval(() => {
                this.notifyMe();
              }, 300000);
            }
          }
        );

      this.resourcesService.findSyncsInProgress()
        .subscribe(data => {
          this.total2 = data;
        },
          error => {
            this.total2 = 0;
          },
          () => {
            if (this.total2 > 0 && this.nIntervId3 == null) {
              this.nIntervId3 = setInterval(() => {
                this.notifyMe2();
              }, 300000);
            }
          }
        );
    }

    else if (this.ROLE_ODMA) {
      this.resourcesService.findSyncsInProgressByUser()
        .subscribe(data => {
          this.total2 = data;
        },
          error => {
            this.total2 = 0;
          },
          () => {
            if (this.total2 > 0 && this.nIntervId3 == null) {
              this.nIntervId3 = setInterval(() => {
                this.notifyMe2();
              }, 300000);
            }
          }
        );
    }

  }

  /**
   * Call this method on start
   */
  callMyMethod() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url == "/home") {
          this.setDashboard();
        } else if (event.url == "/sends" || event.url == "/receives") {
          this.setBackup();
        } else if (event.url == "/ironkeys" || event.url == "/districts" || event.url == "/transporters" || event.url == "/users" || event.url == "/servers") {
          this.setMetadata();
        } else if (event.url == "/syncs") {
          this.setSync();
        } else if (event.url.charAt(14) == "/") {
          this.setUser();
        }
      }
    }
    );
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');
    if (window.sessionStorage.getItem('authenticated')) {
      this.isAuth = true;
      this.translate.use(this.user.locale);
    }
    this.showNavBar = true;

    if (this.ROLE_SIS || this.ROLE_ODMA) {

      this.callFuntionAtIntervals();
      this.nIntervId = setInterval(() => {
        this.callFuntionAtIntervals();
      }, 180000);
    }
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url == "/home") {
          this.setDashboard();
        } else if (event.url == "/sends" || event.url == "/receives") {
          this.setBackup();
        } else if (event.url == "/ironkeys" || event.url == "/districts" || event.url == "/transporters" || event.url == "/users" || event.url == "/servers") {
          this.setMetadata();
        } else if (event.url == "/syncs") {
          this.setSync();
        } else if (event.url.charAt(14) == "/") {
          this.setUser();
        }
      }
    });
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');
    if (window.sessionStorage.getItem('authenticated')) {
      this.isAuth = true;
      this.translate.use(this.user.locale);
      if (this.ROLE_SIS|| this.ROLE_ODMA) {
        this.callFuntionAtIntervals();
        this.nIntervId = setInterval(() => {
          this.callFuntionAtIntervals();
        }, 180000);
      }
    } else {
      if (this.ROLE_SIS || this.ROLE_ODMA) {
        clearInterval(this.nIntervId);
        clearInterval(this.nIntervId2);
        clearInterval(this.nIntervId3);
      }
      this.router.navigate(['login']);
    }
    this.showNavBar = true;
  }

  logout() {
    if (this.ROLE_SIS || this.ROLE_ODMA) {
      clearInterval(this.nIntervId);
      clearInterval(this.nIntervId2);
      clearInterval(this.nIntervId3);
    }
    window.sessionStorage.clear();
    this.isAuth = false;
    this.router.navigate(['login']);
  }

  setDashboard() {
    this.activeDashboard = "active";
    this.activeBackup = "";
    this.activeMetadata = "";
    this.activeUser = "";
    this.activeSync = "";
  }

  setBackup() {
    this.activeDashboard = "";
    this.activeBackup = "active";
    this.activeMetadata = "";
    this.activeUser = "";
    this.activeSync = "";
  }

  setMetadata() {
    this.activeDashboard = "";
    this.activeBackup = "";
    this.activeMetadata = "active";
    this.activeUser = "";
    this.activeSync = "";
  }

  setUser() {
    this.activeDashboard = "";
    this.activeBackup = "";
    this.activeMetadata = "";
    this.activeUser = "active";
    this.activeSync = "";
  }

  setSync() {
    this.activeDashboard = "";
    this.activeBackup = "";
    this.activeMetadata = "";
    this.activeUser = "";
    this.activeSync = "active";
  }

  notifyMe() {

    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if ((Notification as any).permission === "granted") {
      // If it's okay let's create a notification   
      if (this.ROLE_SIS) {
        var exist, backup;
        if (this.total == 1) {
          exist = "existe ";
          backup = " backup ";
        } else {
          exist = "existem ";
          backup = " backups ";
        }
        let options = {
          body: this.user.person.others_names + " " + this.user.person.surname + ", " + exist + this.total + backup + "por receber!",
          icon: "../assets/images/bell-icon.png"
        };
        var notification = new Notification("SCB", options);
      }
      clearInterval(this.nIntervId2);
      this.nIntervId2 = null;
    }

    // Otherwise, we need to ask the user for permission
    else if ((Notification as any).permission !== "denied") {
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          if (this.ROLE_SIS) {
            var exist, backup;
            if (this.total == 1) {
              exist = "existe ";
              backup = " backup ";
            } else {
              exist = "existem ";
              backup = " backups ";
            }
            let options = {
              body: this.user.person.others_names + " " + this.user.person.surname + ", " + exist + this.total + backup + "por receber!",
              icon: "../assets/images/bell-icon.png"
            };
            var notification = new Notification("SCB", options);
            clearInterval(this.nIntervId2);
            this.nIntervId2 = null;
          }
        }
      });
    }
  }

  notifyMe2() {

    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if ((Notification as any).permission === "granted") {
      // If it's okay let's create a notification   
      if (this.ROLE_SIS || this.ROLE_ODMA) {
        var exist, backup;
        if (this.total == 1) {
          exist = "existe ";
          backup = " sincronização ";
        } else {
          exist = "existem ";
          backup = " sincronizações ";
        }
        let options = {
          body: this.user.person.others_names + " " + this.user.person.surname + ", " + exist + this.total + backup + "em processo!",
          icon: "../assets/images/bell-icon.png"
        };
        var notification = new Notification("SCB", options);
      }
      clearInterval(this.nIntervId3);
      this.nIntervId3 = null;
    }

    // Otherwise, we need to ask the user for permission
    else if ((Notification as any).permission !== "denied") {
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          if (this.ROLE_SIS || this.ROLE_ODMA) {
            var exist, backup;
            if (this.total == 1) {
              exist = "existe ";
              backup = " sincronização ";
            } else {
              exist = "existem ";
              backup = " sincronizações ";
            }
            let options = {
              body: this.user.person.others_names + " " + this.user.person.surname + ", " + exist + this.total + backup + "em processo!",
              icon: "../assets/images/bell-icon.png"
            };
            var notification = new Notification("SCB", options);
          }
          clearInterval(this.nIntervId3);
          this.nIntervId3 = null;

        }
      });
    }

    // At last, if the user has denied notifications, and you 
    // want to be respectful there is no need to bother them any more.
  }


}