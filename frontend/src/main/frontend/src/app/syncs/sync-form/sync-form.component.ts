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
import { MatSnackBar} from '@angular/material';
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
  public maxDate=new Date();

  public exportTime24;exportTime242;

  constructor(
    formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public syncsService: SyncsService,
    public serversService: ServersService,
    public transportersService: TransportersService,
    public snackBar: MatSnackBar,
    public translate: TranslateService,
    public datepipe: DatePipe,
    public nav: NavbarService
  ) {
    this.form = formBuilder.group({
      server: [null, [
        Validators.required]],
      startTime: [],
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
      powerCut: [],
      syncErrorResolved: [],
      serverFaultResolved: [],
      laptopFaultResolved: [],
      powerCutResolved: []
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

        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        this.exportTime24 = {hour: hours, minute: minutes, meriden: null, format: 24};
        this.exportTime242 = {hour: hours, minute: minutes, meriden: null, format: 24};
        
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


        this.syncsService.findOneSyncByUuid(uuid, "observation,syncId,startTime,startItemsToSend,startItemsToReceive,endTime,endItemsToSend,endItemsToReceive,observationHis,dateCreated,dateUpdated,syncError,createdBy.uid,createdBy.userId,createdBy.person.othersNames,createdBy.person.surname,createdBy.person.phoneNumber,uid,serverFault,laptopFault,powerCut,canceled,district.name,server.name,server.district.name,server.type,server.serverId,server.uid,server.district.uid,server.district.districtId,syncErrorResolved,serverFaultResolved,laptopFaultResolved,powerCutResolved")
          .subscribe(
            sync => {
              this.sync = sync;
             
                var date = new Date(this.sync.startTime);
                var hours = date.getHours();
                var minutes = date.getMinutes();
               
                this.exportTime24 = {hour: hours, minute: minutes, meriden: null, format: 24};

                if(this.sync.endTime){
                  var date2 = new Date(this.sync.endTime);
                  var hours2 = date2.getHours();
                  var minutes2 = date2.getMinutes();
                 
                  this.exportTime242 = {hour: hours2, minute: minutes2, meriden: null, format: 24};
                }else{
                  var date3 = new Date();
                  var hours3 = date3.getHours();
        var minutes3 = date3.getMinutes();
        this.exportTime242 = {hour: hours3, minute: minutes3, meriden: null, format: 24};

                  this.sync.endItemsToSend=null;
                  this.sync.endItemsToReceive=null;

                }


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

              /*if (new Date(this.sync.startTime))

                this.sync.startTime = ("0" + new Date(this.sync.startTime).getHours()).slice(-2) + ":" + ("0" + new Date(this.sync.startTime).getMinutes()).slice(-2)
              if (this.sync.endTime != null) {
                this.sync.endTime = ("0" + new Date(this.sync.endTime).getHours()).slice(-2) + ":" + ("0" + new Date(this.sync.endTime).getMinutes()).slice(-2)
              }*/

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

    userValue.startTime=this.exportTime24.hour+":"+this.exportTime24.minute;
    userValue.endTime=this.exportTime242.hour+":"+this.exportTime242.minute;
  
    
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    if (this.sync.uid) {

      if (userValue.server.district.districtId==null) {
        this.openSnackBar("Escolha um servidor!", "OK");
        this.isDisabled = false;
      } else

      if (new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + " " + userValue.startTime) > new Date() || new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + " " + userValue.endTime) > new Date()) {
        this.openSnackBar("O registo não deve estar no futuro!", "OK");
        this.isDisabled = false;
      } else
        if (new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + " " + userValue.startTime ) > new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + " " + userValue.endTime )) {
          this.openSnackBar("Hora Final deve ser maior!", "OK");
          this.isDisabled = false;
        } else
          if (userValue.canceled == true && userValue.canceledReason == null) {
            this.openSnackBar("Escreva a razão para anular!", "OK");
            this.isDisabled = false;
          }
          else if (userValue.endItemsToSend > userValue.startItemsToSend || userValue.endItemsToReceive > userValue.startItemsToReceive) {
            this.openSnackBar("Nº de itens no fim da sincronização não deve ser maior que no inicio.!", "OK");
            
            this.isDisabled = false;
          }
          else if (userValue.endItemsToSend < 0 || userValue.endItemsToReceive < 0 ||  userValue.startItemsToReceive < 0 || userValue.startItemsToSend < 0) {
            this.openSnackBar("Nº de itens não deve ser inferior a 0!", "OK");
            this.isDisabled = false;
          }
          
          else {

             if ((userValue.endTime != null && userValue.endTime != "") && (userValue.endItemsToSend == null || userValue.endItemsToReceive == null)) {
              userValue.endTime=null;
            }

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
              userValue.startTime = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + " " + userValue.startTime );

              if (userValue.endTime != null && userValue.endTime != "") {
                userValue.endTime = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + " " + userValue.endTime );
              }
              else {
                userValue.endItemsToSend = null;
                userValue.endItemsToSend = null;
                userValue.endTime = null;
              }

              result = this.syncsService.updateSync(userValue).subscribe(data => { }, error => { }, () => { this.router.navigate(['syncs']); this.nav.callMethodOfSecondComponent(); });
              this.openSnackBar("Registo actualizado com sucesso!", "OK");
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

              userValue.startTime = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + " " + userValue.startTime );

              if (userValue.endTime != null && userValue.endTime != "") {
                userValue.endTime = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + " " + userValue.endTime );
              }
              else {
                userValue.endItemsToSend = null;
                userValue.endItemsToSend = null;
                userValue.endTime = null;
              }



              result = this.syncsService.updateSync(userValue).subscribe(data => { }, error => { }, () => { this.router.navigate(['syncs']); this.nav.callMethodOfSecondComponent(); });
              this.openSnackBar("Registo actualizado com sucesso!", "OK");
              this.nav.callMethodOfSecondComponent();

            }

          }


    } else {

      if (userValue.server.district.districtId==null) {
        this.openSnackBar("Escolha um servidor!", "OK");
        this.isDisabled = false;
      } else

      if (new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + " " + userValue.startTime ) > new Date() || new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + " " + userValue.endTime ) > new Date()) {
        this.openSnackBar("O registo não deve estar no futuro!", "OK");
        this.isDisabled = false;
      } else
        if (new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + " " + userValue.startTime ) > new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + " " + userValue.endTime )) {
          this.openSnackBar("Hora Final deve ser maior!", "OK");
          this.isDisabled = false;
        } else
          if (userValue.canceled == true && userValue.canceledReason == null) {
            this.openSnackBar("Escreva a razão para anular!", "OK");
            this.isDisabled = false;
          }
          else if (userValue.endItemsToSend > userValue.startItemsToSend || userValue.endItemsToReceive > userValue.startItemsToReceive) {
            this.openSnackBar("Nº de itens no fim da sincronização não deve ser maior que no inicio.!", "OK");
            this.isDisabled = false;
          }
          else if (userValue.endItemsToSend < 0 || userValue.endItemsToReceive < 0 ||  userValue.startItemsToReceive < 0 || userValue.startItemsToSend < 0) {
            this.openSnackBar("Nº de itens não deve ser inferior a 0!", "OK");
            this.isDisabled = false;
          }
          else {

            if ((userValue.endTime != null && userValue.endTime != "") && (userValue.endItemsToSend == null || userValue.endItemsToReceive == null)) {
              userValue.endTime=null;
            }

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

              userValue.startTime = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + " " + userValue.startTime );

              if (userValue.endTime != null && userValue.endTime != "") {
                userValue.endTime = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + " " + userValue.endTime );
              }
              else {
                userValue.endItemsToSend = null;
                userValue.endItemsToSend = null;
                userValue.endTime = null;
              }


              result = this.syncsService.createSync(userValue).subscribe(data => { }, error => { }, () => { this.router.navigate(['syncs']); this.nav.callMethodOfSecondComponent(); });
              this.openSnackBar("Registo criado com sucesso!", "OK");
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

              userValue.startTime = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + " " + userValue.startTime );

              if (userValue.endTime != null && userValue.endTime != "") {
                userValue.endTime = new Date(this.datepipe.transform(new Date(), 'yyyy-MM-dd') + " " + userValue.endTime );
              }
              else {
                userValue.endItemsToSend = null;
                userValue.endItemsToSend = null;
                userValue.endTime = null;
              }

              result = this.syncsService.createSync(userValue).subscribe(data => { }, error => { }, () => { this.router.navigate(['syncs']); this.nav.callMethodOfSecondComponent(); });
              this.openSnackBar("Registo criado com sucesso!", "OK");

            }

          
    }

  }
}

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

  syncError(){

    if(this.sync.syncError==false){
      this.sync.syncErrorResolved=false;
    }

  }

  serverFault(){

    if(this.sync.serverFault==false){
      this.sync.serverFaultResolved=false;
    }

  }

  laptopFault(){

    if(this.sync.laptopFault==false){
      this.sync.laptopFaultResolved=false;
    }

  }

  powerCut(){

    if(this.sync.powerCut==false){
      this.sync.powerCutResolved=false;
    }

  }

}