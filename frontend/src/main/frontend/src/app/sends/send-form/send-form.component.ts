/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Send } from '../shared/send';
import { SendsService } from '../shared/sends.service';
import { DistrictsService } from './../../districts/shared/districts.service';
import { District } from './../../districts/shared/district';
import { TransportersService } from './../../transporters/shared/transporters.service';;
import { Transporter } from './../../transporters/shared/transporter';
import { MzToastService } from 'ngx-materialize';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-send-form',
  templateUrl: './send-form.component.html',
  styleUrls: ['./send-form.component.css']
})

/** 
* @author Damasceno Lopes
*/
export class SendFormComponent implements OnInit {
  public form: FormGroup;
  public ROLE_SIS; ROLE_IT; ROLE_OA; ROLE_GMA; ROLE_ODMA; ROLE_ORMA; ROLE_GDD: string;
  public title: string;
  public isHidden: string;
  public isDisabled: boolean;
  public send: Send = new Send();
  public alldistricts: District[] = [];
  public alltransporters: Transporter[] = [];
  public allsends: Send[] = [];
  public disabled1: boolean;
  public options: Pickadate.DateOptions = {
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyy-mm-dd',
    today: 'Hoje',
    close: 'Fechar',
    clear:'Limpar',
    max: new Date()
  };

   
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public sendsService: SendsService,
    public districtsService: DistrictsService,
    public transportersService: TransportersService,
    public toastService: MzToastService,
    public translate: TranslateService
  ) {
    this.form = formBuilder.group({
      district: ['', [
        Validators.required]],
      transporter: ['', [
        Validators.required
      ]],
      backupDate: ['', [
        Validators.required
      ]],
      updateFinished: [],
      validationFinished: [],
      syncFinished: [],
      crossDhis2Finished: [],
      crossIdartFinished: [],
      observation: ['', [
        Validators.required
      ]],
      canceled: [],
      canceledReason: [],
      received: [],
      ikReceived: [],
      dateIkReceived: [],
      idartBackup:[],
      idartBackupDate:[]
    });
  }
  ngOnInit() {
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');
    this.disabled1 = true;
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    var uuid = this.route.params.subscribe(params => {
      var uuid = params['uuid'];
      this.title = uuid ? 'Editar Envio de Backup' : 'Enviar Backup';
      this.isHidden = uuid ? '' : 'hide';
      if (!uuid) {

        this.alldistricts = user.districts;

        this.alldistricts.sort(function (a, b) {
          var nameA = a.fullName.toUpperCase(); // ignore upper and lowercase
          var nameB = b.fullName.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        this.transportersService.findTransporters("", "", "", "", false,"name,phoneNumber,transporterId,uid,role")
          .subscribe(data => { this.alltransporters = data.content; }
            , errot => { },
            () => {
              this.disabled1 = false;
            }
          );

      } else {
        this.sendsService.findOneSendByUuid(uuid,"district.name,district.parent.name,transporter.transporterId,sendId,transporter.uid,district.uid,observation,transporter.phoneNumber,transporter.name,district.districtId,district.fullName,received,dateCreated,createdBy.uid,createdBy.userId,uid,backupDate,updateFinished,validationFinished,syncFinished,crossDhis2Finished,crossIdartFinished,uid,ikReceived,dateIkReceived,idartBackup,idartBackupDate")
          .subscribe(
            send => {
              this.send = send;
              this.alldistricts = user.districts;
              var filtereddistricts = this.alldistricts;
              filtereddistricts = filtereddistricts.filter(item => item.districtId !== this.send.district.districtId);

              if (!this.ROLE_SIS && user.districts.find(item => item.parent != null)) {
                filtereddistricts = filtereddistricts.filter(item => item.parent != null);
              }

              filtereddistricts.push(this.send.district);
              this.alldistricts = filtereddistricts.sort(function (a, b) {
                var nameA = a.fullName.toUpperCase(); // ignore upper and lowercase
                var nameB = b.fullName.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              });
              this.transportersService.findTransporters("", "", "", "", false,"name,phoneNumber,transporterId,uid,role")
                .subscribe(data => {
                  this.alltransporters = data.content;
                  var filteredtransporters = this.alltransporters;
                  filteredtransporters = filteredtransporters.filter(item => item.transporterId !== this.send.transporter.transporterId);
                  filteredtransporters.push(this.send.transporter);
                  this.alltransporters = filteredtransporters.sort(function (a, b) {
                    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }
                    return 0;
                  });
                }, errot => { },
                  () => {
                    this.disabled1 = false;
                  });
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
    var userLogged = JSON.parse(window.sessionStorage.getItem('user'));
    if (this.send.uid) {
      if (new Date(userValue.backupDate) > new Date()) {
        this.showMsgErr();
        this.isDisabled = false;
      }
      else {
        if (userValue.canceled == true && userValue.canceledReason == null) {
          this.showMsgErr3();
          this.isDisabled = false;
        }
        else if (userValue.ikReceived == true && (userValue.dateIkReceived == null)) {
          this.showMsgErr4();
          this.isDisabled = false;
        }else if (userValue.idartBackup == true && (userValue.idartBackupDate == null||(new Date(userValue.idartBackupDate)>new Date()))) {
          this.showMsgErr5();
          this.isDisabled = false;
        }
        else {
          userValue.sendId = this.send.sendId;
          userValue.dateCreated = this.send.dateCreated;
          userValue.uid = this.send.uid;
          userValue.received=this.send.received;
          userValue.createdBy = this.send.createdBy;
          userValue.updatedBy = {
            uid: userLogged.uid,
            userId: userLogged.userId
          };
          result = this.sendsService.updateSend(userValue);
          result.subscribe(data => this.router.navigate(['sends']));
          this.showMsg();
        }
      }
    } else {
      if (new Date(userValue.backupDate) > new Date()) {
        this.showMsgErr();
        this.isDisabled = false;
      }else if (userValue.idartBackup == true && (userValue.idartBackupDate == null||(new Date(userValue.idartBackupDate)>new Date()))) {
        this.showMsgErr5();
        this.isDisabled = false;
      }
      else {
        userValue.createdBy = {
          person: {
            othersNames: userLogged.person.othersNames,
            surname: userLogged.person.surname,
            phoneNumber: userLogged.person.phoneNumber
          },
          uid: userLogged.uid,
          userId: userLogged.userId
        };
        result = this.sendsService.createSend(userValue);
        result.subscribe(data => this.router.navigate(['sends']));
        this.showMsg();
      }
    }
  }

  refreshTransporter(){
    this.disabled1 = true;
    this.transportersService.findTransporters("", "", "", "", false,"name,phoneNumber,transporterId,uid,role")
          .subscribe(data => { this.alltransporters = data.content; }
            , errot => { },
            () => {
              this.disabled1 = false;
            }
          );
  }

  showMsg() {
    this.toastService.show('Envio de Backup salvo com sucesso!', 2000, 'green', null);
  }
  showMsgErr() {
    this.toastService.show('A Data do Backup não deve estar no futuro!', 2000, 'red', null);
  }
  showMsgErr3() {
    this.toastService.show('Escreva a razão para anular!', 2000, 'red', null);
  }
  showMsgErr4() {
    this.toastService.show('A Data de Recepção deve ser preenchida!', 2000, 'red', null);
  }
  showMsgErr5() {
    this.toastService.show('A data do backup de iDART deve ser preenchida e não deve estar no futuro!', 2000, 'red', null);
  }
}