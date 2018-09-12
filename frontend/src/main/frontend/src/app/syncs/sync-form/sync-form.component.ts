/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Sync } from '../shared/sync';
import { SyncsService } from '../shared/syncs.service';
import { ServersService } from './../../servers/shared/servers.service';
import { Server } from './../../servers/shared/server';
import { TransportersService } from './../../transporters/shared/transporters.service';;
import { Transporter } from './../../transporters/shared/transporter';
import { MzToastService } from 'ng2-materialize';
import { TranslateService } from 'ng2-translate';
import { DatePipe } from '@angular/common';
import * as alasql from 'alasql';
import { NavbarService } from '../../nav-bar/nav-bar.service';

@Component({
  selector: 'app-sync-form',
  templateUrl: './sync-form.component.html',
  styleUrls: ['./sync-form.component.css']
})

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class SyncFormComponent implements OnInit {
  public form: FormGroup;
  public title: string;
  public isHidden: string;
  public isDisabled: boolean;
  public sync: Sync = new Sync();
  public allservers: Server[] = [];
  public alltransporters: Transporter[] = [];
  public allsyncs: Sync[] = [];
  public ROLE_SIS: string;
  public ROLE_IT: string;
  public ROLE_OA: string;
  public ROLE_GMA: string;
  public ROLE_ODMA: string;
  public ROLE_ORMA: string;
  public ROLE_GDD: string; public disabled1: boolean;

  public options: Pickadate.DateOptions = {
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyy-mm-dd',
  };

  public timepickerOptions: Pickadate.TimeOptions = {
    default: 'now', // Set default time: 'now', '1:30AM', '16:30'
    fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
    twelvehour: false, // Use AM/PM or 24-hour format
    donetext: 'OK', // text for done-button
    cleartext: 'Clear', // text for clear-button
    canceltext: 'Cancel', // Text for cancel-button
    autoclose: true, // automatic close timepicker
    ampmclickable: true, // make AM PM clickable
    aftershow: () => alert('AfterShow has been invoked.'), // function for after opening timepicker
  };

     
  constructor(
    formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public syncsService: SyncsService,
    public serversService: ServersService,
    public transportersService: TransportersService,
    public toastService: MzToastService,
    public translate: TranslateService,
    public datepipe: DatePipe,
    public nav: NavbarService
  ) {
    this.form = formBuilder.group({
      server: ['', [
        Validators.required]],
      start_time: ['', [
        Validators.required
      ]],
      start_time_time: ['', [
        Validators.required
      ]],
      start_items_to_send: ['', [
        Validators.required
      ]],
      start_items_to_receive: ['', [
        Validators.required
      ]],
      end_time: [],
      end_time_time: [],
      end_items_to_send: [],
      end_items_to_receive: [],
      observation: [],
      observation_his: [],
      canceled: [],
      canceled_reason: [],
      sync_error: [],
      serverfault: [],
      laptopfault: [],
      powercut: []
    });
  }
  ngOnInit() {
    this.isDisabled = false;
    this.disabled1 = true;
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');
    var uuid = this.route.params.subscribe(params => {
      var uuid = params['uuid'];
      this.title = uuid ? 'Editar Registo de Sincronização' : 'Registar Sincronização';
      this.isHidden = uuid ? '' : 'hide';
      if (!uuid) {


        if (this.ROLE_GDD || this.ROLE_ODMA || this.ROLE_ORMA) {

          this.serversService.findServers("", "", "", "", false, "")
            .subscribe(data => {
              this.allservers = data.content;
              this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,servers->name ASC", [this.allservers]);

            }, error => { }, () => { this.disabled1 = false; });


        } else if (this.ROLE_SIS || this.ROLE_GMA || this.ROLE_OA) {

          this.serversService.findServers("", "", "", "", false, "")
            .subscribe(data => {
              this.allservers = data.content;
              this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,servers->name ASC", [this.allservers]);
            }, error => { }, () => { this.disabled1 = false; });
        }
      } else {
        this.syncsService.findOneSyncByUuid(uuid)
          .subscribe(
            sync => {
              this.sync = sync;
              if (this.ROLE_GDD || this.ROLE_ODMA || this.ROLE_ORMA) {
                this.serversService.findServers("", "", "", "", false, "")
                  .subscribe(data => {
                    this.allservers = data.content;
                    var filteredservers = this.allservers;
                    filteredservers = filteredservers.filter(item => item.server_id !== this.sync.server.server_id);
                    filteredservers.push(this.sync.server);

                    this.allservers = filteredservers;
                    this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,servers->name ASC", [this.allservers]);


                  }, error => { }, () => { this.disabled1 = false; });


              } else if (this.ROLE_SIS || this.ROLE_GMA || this.ROLE_OA) {


                this.serversService.findServers("", "", "", "", false, "")
                  .subscribe(data => {
                    this.allservers = data.content;
                    var filteredservers = this.allservers;
                    filteredservers = filteredservers.filter(item => item.server_id !== this.sync.server.server_id);
                    filteredservers.push(this.sync.server);
                    this.allservers = filteredservers;
                    this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,servers->name ASC", [this.allservers]);

                  }, error => { }, () => { this.disabled1 = false; });

              }
            });

      }

    });
  }


  save() {
    this.isDisabled = true;
    var result, userValue = this.form.value;
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    if (this.sync.uuid) {

      if (
        new Date(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + "T" + userValue.start_time_time + ":00.000") > new Date()
        || ((userValue.end_time_time != null && userValue.end_time_time != "") && new Date(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + "T" + userValue.end_time_time + ":00.000") > new Date())
        || new Date(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + "T" + userValue.start_time_time + ":00.000") < new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T00:00:00.000")) {
        this.showMsgErr();
        this.isDisabled = false;
      }
      else {
        if (userValue.canceled == true && userValue.canceled_reason == null) {
          this.showMsgErr3();
          this.isDisabled = false;
        }
        else if ((userValue.end_time_time != null && userValue.end_time_time != "") && (this.datepipe.transform(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + " " + userValue.start_time_time, 'yyyy-MM-dd HH:mm') > this.datepipe.transform(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + " " + userValue.end_time_time, 'yyyy-MM-dd HH:m'))) {
          this.showMsgErr4();
          this.isDisabled = false;
        }
        else if (userValue.end_items_to_send > userValue.start_items_to_send || userValue.end_items_to_receive > userValue.start_items_to_receive) {
          this.showMsgErr5();
          this.isDisabled = false;
        } 
        else if ((userValue.end_time_time!=null&&userValue.end_time_time!="")&&(userValue.end_items_to_send==null||userValue.end_items_to_receive==null)) {
          this.showMsgErr7();
          this.isDisabled = false;
        }
        else {

          if (this.ROLE_GDD || this.ROLE_ODMA || this.ROLE_ORMA) {

            if (userValue.observation == "" || userValue.observation == null) {

              this.showMsgErr6();
              this.isDisabled = false;
            } else {

              userValue.sync_id = this.sync.sync_id;
              userValue.date_created = this.sync.date_created;
              userValue.uuid = this.sync.uuid;
              userValue.created_by = this.sync.created_by;
              userValue.updated_by = user;
              userValue.observation_his = this.sync.observation_his;
              userValue.start_time = new Date(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + "T" + userValue.start_time_time + ":00.000");

              if (userValue.end_time_time != null && userValue.end_time_time != "") {
                userValue.end_time = new Date(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + "T" + userValue.end_time_time + ":00.000");
              }
              else {
                userValue.end_items_to_send = null;
                userValue.end_items_to_send = null;
                userValue.end_time = null;
              }

              result = this.syncsService.updateSync(userValue).subscribe(data => {},error=>{},()=>{this.router.navigate(['syncs']);this.nav.callMethodOfSecondComponent();});
              this.showMsg();
              this.nav.callMethodOfSecondComponent();


            }

          } else if (this.ROLE_SIS) {

            if (userValue.observation_his == "" || userValue.observation_his == null) {

              this.showMsgErr6();
              this.isDisabled = false;
            } else {

              userValue.sync_id = this.sync.sync_id;
              userValue.date_created = this.sync.date_created;
              userValue.uuid = this.sync.uuid;
              userValue.created_by = this.sync.created_by;
              userValue.updated_by = user;
              userValue.observation = this.sync.observation;

              userValue.start_time = new Date(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + "T" + userValue.start_time_time + ":00.000");

              if (userValue.end_time_time != null && userValue.end_time_time != "") {
                userValue.end_time = new Date(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + "T" + userValue.end_time_time + ":00.000");
              }
              else {
                userValue.end_items_to_send = null;
                userValue.end_items_to_receive = null;
                userValue.end_time = null;
              }

              result = this.syncsService.updateSync(userValue).subscribe(data => {},error=>{},()=>{this.router.navigate(['syncs']);this.nav.callMethodOfSecondComponent();});
              this.showMsg();
              this.nav.callMethodOfSecondComponent();


            }

          }

        }
      }

    } else {


      if (new Date(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + "T" + userValue.start_time_time + ":00.000") > new Date()
        || ((userValue.end_time_time != null && userValue.end_time_time != "") && new Date(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + "T" + userValue.end_time_time + ":00.000") > new Date())
        || new Date(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + "T" + userValue.start_time_time + ":00.000") < new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T00:00:00.000")) {
        this.showMsgErr();
        this.isDisabled = false;
      }
      else {
        if ((userValue.end_time_time != null && userValue.end_time_time != "") && (this.datepipe.transform(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + " " + userValue.start_time_time, 'yyyy-MM-dd HH:mm') > this.datepipe.transform(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + " " + userValue.end_time_time, 'yyyy-MM-dd HH:m'))) {
          this.showMsgErr4();
          this.isDisabled = false;
        }
        else if (userValue.end_items_to_send > userValue.start_items_to_send || userValue.end_items_to_receive > userValue.start_items_to_receive) {
          this.showMsgErr5();
          this.isDisabled = false;
        }else if ((userValue.end_time_time!=null&&userValue.end_time_time!="")&&(userValue.end_items_to_send==null||userValue.end_items_to_receive==null)) {
          this.showMsgErr7();
          this.isDisabled = false;
        }
        else {

          if (this.ROLE_GDD || this.ROLE_ODMA || this.ROLE_ORMA) {

            if (userValue.observation == "" || userValue.observation == null) {

              this.showMsgErr6();
              this.isDisabled = false;
            } else {

              userValue.created_by = user;
              userValue.start_time = new Date(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + "T" + userValue.start_time_time + ":00.000");

              if (userValue.end_time_time != null && userValue.end_time_time != "") {
                userValue.end_time = new Date(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + "T" + userValue.end_time_time + ":00.000");
              }
              else {
                userValue.end_items_to_send = null;
                userValue.end_items_to_receive = null;
                userValue.end_time = null;
              }



              result = this.syncsService.createSync(userValue).subscribe(data => {},error=>{},()=>{this.router.navigate(['syncs']);this.nav.callMethodOfSecondComponent();});
              this.showMsg();
              this.nav.callMethodOfSecondComponent();

            }

          } else if (this.ROLE_SIS) {

            if (userValue.observation_his == "" || userValue.observation_his == null) {

              this.showMsgErr6();
              this.isDisabled = false;
            } else {

              userValue.created_by = user;

               userValue.start_time = new Date(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + "T" + userValue.start_time_time + ":00.000");

              if (userValue.end_time_time != null && userValue.end_time_time != "") {
                userValue.end_time = new Date(this.datepipe.transform(new Date(userValue.start_time), 'yyyy-MM-dd') + "T" + userValue.end_time_time + ":00.000");
              }
              else {
                userValue.end_items_to_send = null;
                userValue.end_items_to_receive = null;
                userValue.end_time = null;
              }


              result = this.syncsService.createSync(userValue).subscribe(data => {},error=>{},()=>{this.router.navigate(['syncs']);this.nav.callMethodOfSecondComponent();});
              this.showMsg();
              

            }

          }

        }
      }

    }
  }

  showMsg() {
    this.toastService.show('Registo de Sincronização salvo com sucesso!', 2000, 'green', null);
  }
  showMsgErr() {
    this.toastService.show('O periodo de Sincronização não deve estar no passado ou futuro!', 2000, 'red', null);
  }
  showMsgErr3() {
    this.toastService.show('Escreva a razão para anular!', 2000, 'red', null);
  }

  showMsgErr4() {
    this.toastService.show('Hora final deve ser maior!', 2000, 'red', null);
  }

  showMsgErr6() {
    this.toastService.show('Escreva uma observação!', 2000, 'red', null);
  }

  showMsgErr7() {
    this.toastService.show('Preenche o nº dos itens por enviar na hora final!', 2000, 'red', null);
  }

  showMsgErr5() {
    this.toastService.show('Nº de itens no fim da sincronização não deve ser maior que no inicio.', 2000, 'red', null);
  }

}