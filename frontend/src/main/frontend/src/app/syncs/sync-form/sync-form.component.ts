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
import { MzToastService } from 'ngx-materialize';
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
* @author Damasceno Lopes
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
    today: 'Hoje',
    close: 'Fechar',
    clear: 'Limpar',
    max: new Date()
  };

  public timepickerOptions: Pickadate.TimeOptions = {
    formatSubmit: 'HH:mm',
    default: 'now',
    fromnow: 0,
    twelvehour: false,
    donetext: 'OK',
    cleartext: 'Limpar',
    canceltext: 'Cancelar',
    autoclose: true,
    ampmclickable: true
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
      startTime: ['', [
        Validators.required
      ]],
      startItemsToSend: ['', [
        Validators.required,Validators.min(0)
      ]],
      startItemsToReceive: ['', [
        Validators.required,Validators.min(0)
      ]],
      endTime: [],
      endItemsToSend: ['',[,Validators.min(0)]],
      endItemsToReceive: ['',[,Validators.min(0)]],
      observation: [],
      observationHis: [],
      canceled: [],
      canceledReason: [],
      syncError: [],
      serverFault: [],
      laptopFault: [],
      powerCut: []
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
      this.title = uuid ? 'Editar Registo de Sincronização' : 'Novo Registo de Sincronização';
      this.isHidden = uuid ? '' : 'hide';
      if (!uuid) {


        if (this.ROLE_GDD || this.ROLE_ODMA || this.ROLE_ORMA) {

          this.serversService.findServers("", "", "", "", false, "", "uid,name,serverId,district.name,district.districtId,district.uid")
            .subscribe(data => {
              this.allservers = data.content;
              this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,name ASC", [this.allservers]);

            }, error => { }, () => { this.disabled1 = false; });


        } else if (this.ROLE_SIS) {

          this.serversService.findServers("", "", "", "", false, "", "uid,name,serverId,district.name,district.districtId,district.uid")
            .subscribe(data => {
              this.allservers = data.content;
              this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,name ASC", [this.allservers]);
            }, error => { }, () => { this.disabled1 = false; });
        }
      } else {
        this.syncsService.findOneSyncByUuid(uuid, "observation,syncId,startTime,startItemsToSend,startItemsToReceive,endTime,endItemsToSend,endItemsToReceive,observationHis,dateCreated,dateUpdated,syncError,createdBy.uid,createdBy.userId,createdBy.person.othersNames,createdBy.person.surname,createdBy.person.phoneNumber,uid,serverFault,laptopFault,powerCut,canceled,district.name,server.name,server.district.name,server.type,server.serverId,server.uid,server.district.uid,server.district.districtId")
          .subscribe(
            sync => {
              this.sync = sync;

              var date = new Date();
              date.setDate(date.getDate() + 1);
              date.setHours(0);
              date.setMinutes(0);
              date.setSeconds(0);
              var date2 = new Date();
              date2.setDate(date2.getDate());
              date2.setHours(0);
              date2.setMinutes(0);
              date2.setSeconds(0);
              if (new Date(this.sync.startTime) > date2 && new Date(this.sync.startTime) < date) {
                
              }
              else {
                this.router.navigate(['not-found']);
              }

              if (new Date(this.sync.startTime))

                this.sync.startTime = ("0" + new Date(this.sync.startTime).getHours()).slice(-2) + ":" + ("0" + new Date(this.sync.startTime).getMinutes()).slice(-2)
              if (this.sync.endTime != null) {
                this.sync.endTime = ("0" + new Date(this.sync.endTime).getHours()).slice(-2) + ":" + ("0" + new Date(this.sync.endTime).getMinutes()).slice(-2)
              }
              if (this.ROLE_GDD || this.ROLE_ODMA || this.ROLE_ORMA) {
                this.serversService.findServers("", "", "", "", false, "", "uid,name,serverId,district.name,district.districtId,district.uid")
                  .subscribe(data => {
                    this.allservers = data.content;
                    var filteredservers = this.allservers;
                    filteredservers = filteredservers.filter(item => item.serverId !== this.sync.server.serverId);
                    filteredservers.push(this.sync.server);

                    this.allservers = filteredservers;
                    this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,name ASC", [this.allservers]);


                  }, error => { }, () => { this.disabled1 = false; });


              } else if (this.ROLE_SIS || this.ROLE_GMA || this.ROLE_OA) {


                this.serversService.findServers("", "", "", "", false, "", "uid,name,serverId,district.name,district.districtId,district.uid")
                  .subscribe(data => {
                    this.allservers = data.content;
                    var filteredservers = this.allservers;
                    filteredservers = filteredservers.filter(item => item.serverId !== this.sync.server.serverId);
                    filteredservers.push(this.sync.server);
                    this.allservers = filteredservers;
                    this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,name ASC", [this.allservers]);

                  }, error => { }, () => { this.disabled1 = false; });

              }
            },
            response => {
              if (response.status == 404) {
                this.router.navigate(['NotFound']);
              }
            });

      }

    });
  }


  save() {
    this.isDisabled = true;
    var result, userValue = this.form.value;
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    if (this.sync.uid) {

      if (new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T" + userValue.startTime + ":00.000") > new Date() || new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T" + userValue.endTime + ":00.000") > new Date()) {
        this.showMsgErr6();
        this.isDisabled = false;
      } else
        if (new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T" + userValue.startTime + ":00.000") > new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T" + userValue.endTime + ":00.000")) {
          this.showMsgErr4();
          this.isDisabled = false;
        } else
          if (userValue.canceled == true && userValue.canceledReason == null) {
            this.showMsgErr3();
            this.isDisabled = false;
          }
          else if (userValue.endItemsToSend > userValue.startItemsToSend || userValue.endItemsToReceive > userValue.startItemsToReceive) {
            this.showMsgErr5();
            this.isDisabled = false;
          }
          else if (userValue.endItemsToSend < 0 || userValue.endItemsToReceive < 0 ||  userValue.startItemsToReceive < 0 || userValue.startItemsToSend < 0) {
            this.showMsgErr5n();
            this.isDisabled = false;
          }
          else if ((userValue.endTime != null && userValue.endTime != "") && (userValue.endItemsToSend == null || userValue.endItemsToReceive == null)) {
            this.showMsgErr7();
            this.isDisabled = false;
          }
          else {

            if (this.ROLE_GDD || this.ROLE_ODMA || this.ROLE_ORMA) {


              userValue.syncId = this.sync.syncId;
              userValue.dateCreated = this.sync.dateCreated;
              userValue.uuid = this.sync.uid;
              userValue.createdBy = this.sync.createdBy;
              userValue.updatedBy = {
                person: {
                  othersNames: user.person.othersNames,
                  surname: user.person.surname,
                  phoneNumber: user.person.phoneNumber
                },
                uid: user.uid,
                userId: user.userId
              };
              userValue.observation = this.sync.observation;
              userValue.startTime = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T" + userValue.startTime + ":00.000");

              if (userValue.endTime != null && userValue.endTime != "") {
                userValue.endTime = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T" + userValue.endTime + ":00.000");
              }
              else {
                userValue.endItemsToSend = null;
                userValue.endItemsToSend = null;
                userValue.endTime = null;
              }

              result = this.syncsService.updateSync(userValue).subscribe(data => { }, error => { }, () => { this.router.navigate(['syncs']); this.nav.callMethodOfSecondComponent(); });
              this.showMsg();
              this.nav.callMethodOfSecondComponent();




            } else if (this.ROLE_SIS) {

              userValue.syncId = this.sync.syncId;
              userValue.dateCreated = this.sync.dateCreated;
              userValue.uuid = this.sync.uid;
              userValue.createdBy = this.sync.createdBy;
              userValue.updatedBy = {
                person: {
                  othersNames: user.person.othersNames,
                  surname: user.person.surname,
                  phoneNumber: user.person.phoneNumber
                },
                uid: user.uid,
                userId: user.userId
              };
              userValue.observationHis = this.sync.observationHis;

              userValue.startTime = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T" + userValue.startTime + ":00.000");

              if (userValue.endTime != null && userValue.endTime != "") {
                userValue.endTime = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T" + userValue.endTime + ":00.000");
              }
              else {
                userValue.endItemsToSend = null;
                userValue.endItemsToSend = null;
                userValue.endTime = null;
              }



              result = this.syncsService.updateSync(userValue).subscribe(data => { }, error => { }, () => { this.router.navigate(['syncs']); this.nav.callMethodOfSecondComponent(); });
              this.showMsg();
              this.nav.callMethodOfSecondComponent();

            }

          }


    } else {


      if (new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T" + userValue.startTime + ":00.000") > new Date() || new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T" + userValue.endTime + ":00.000") > new Date()) {
        this.showMsgErr6();
        this.isDisabled = false;
      } else
        if (new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T" + userValue.startTime + ":00.000") > new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T" + userValue.endTime + ":00.000")) {
          this.showMsgErr4();
          this.isDisabled = false;
        } else
          if (userValue.canceled == true && userValue.canceledReason == null) {
            this.showMsgErr3();
            this.isDisabled = false;
          }
          else if (userValue.endItemsToSend > userValue.startItemsToSend || userValue.endItemsToReceive > userValue.startItemsToReceive) {
            this.showMsgErr5();
            this.isDisabled = false;
          }
          else if (userValue.endItemsToSend < 0 || userValue.endItemsToReceive < 0 ||  userValue.startItemsToReceive < 0 || userValue.startItemsToSend < 0) {
            this.showMsgErr5n();
            this.isDisabled = false;
          }
          else if ((userValue.endTime != null && userValue.endTime != "") && (userValue.endItemsToSend == null || userValue.endItemsToReceive == null)) {
            this.showMsgErr7();
            this.isDisabled = false;
          }
          else {

            if (this.ROLE_GDD || this.ROLE_ODMA || this.ROLE_ORMA) {

              userValue.createdBy = {
                person: {
                  othersNames: user.person.othersNames,
                  surname: user.person.surname,
                  phoneNumber: user.person.phoneNumber
                },
                uid: user.uid,
                userId: user.userId
              };

              userValue.startTime = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T" + userValue.startTime + ":00.000");

              if (userValue.endTime != null && userValue.endTime != "") {
                userValue.endTime = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T" + userValue.endTime + ":00.000");
              }
              else {
                userValue.endItemsToSend = null;
                userValue.endItemsToSend = null;
                userValue.endTime = null;
              }


              result = this.syncsService.createSync(userValue).subscribe(data => { }, error => { }, () => { this.router.navigate(['syncs']); this.nav.callMethodOfSecondComponent(); });
              this.showMsg();
              this.nav.callMethodOfSecondComponent();

            } else if (this.ROLE_SIS) {

              userValue.createdBy = {
                person: {
                  othersNames: user.person.othersNames,
                  surname: user.person.surname,
                  phoneNumber: user.person.phoneNumber
                },
                uid: user.uid,
                userId: user.userId
              };

              userValue.startTime = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T" + userValue.startTime + ":00.000");

              if (userValue.endTime != null && userValue.endTime != "") {
                userValue.endTime = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + "T" + userValue.endTime + ":00.000");
              }
              else {
                userValue.endItemsToSend = null;
                userValue.endItemsToSend = null;
                userValue.endTime = null;
              }

              result = this.syncsService.createSync(userValue).subscribe(data => { }, error => { }, () => { this.router.navigate(['syncs']); this.nav.callMethodOfSecondComponent(); });
              this.showMsg();

            }

          }
    }

  }

  showMsg() {
    this.toastService.show('Registo de Sincronização salvo com sucesso!', 2000, 'green', null);
  }
  showMsgErr3() {
    this.toastService.show('Escreva a razão para anular!', 2000, 'red', null);
  }

  showMsgErr4() {
    this.toastService.show('Hora final deve ser maior!', 2000, 'red', null);
  }

  showMsgErr6() {
    this.toastService.show('Registo não deve estar no futuro!', 2000, 'red', null);
  }

  showMsgErr7() {
    this.toastService.show('Preenche o nº dos itens por enviar/receber na hora final!', 2000, 'red', null);
  }

  showMsgErr5() {
    this.toastService.show('Nº de itens no fim da sincronização não deve ser maior que no inicio.', 2000, 'red', null);
  }

  showMsgErr5n() {
    this.toastService.show('Nº de itens não deve ser inferior a 0.', 2000, 'red', null);
  }

}