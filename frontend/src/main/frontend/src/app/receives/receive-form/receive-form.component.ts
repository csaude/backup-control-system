/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Receive } from '../shared/receive';
import { ReceivesService } from '../shared/receives.service';
import { SendsService } from "../../sends/shared/sends.service";
import { Send } from "../../sends/shared/send";
import { TransportersService } from './../../transporters/shared/transporters.service';;
import { Transporter } from './../../transporters/shared/transporter';
import { MzToastService } from 'ngx-materialize';
import { TranslateService } from 'ng2-translate';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-receive-form',
  templateUrl: './receive-form.component.html',
  styleUrls: ['./receive-form.component.css']
})

/** 
* @author Damasceno Lopes
*/
export class ReceiveFormComponent implements OnInit {
  public form: FormGroup;
  public title: string;
  public isHidden: string;
  public isDisabled: boolean;
  public receive: Receive = new Receive();
  public send: Send = new Send();
  public openFunctionCallback; closeFunctionCallback;
  public alltransporters: Transporter[] = [];
  public options: Pickadate.DateOptions = {
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyy-mm-dd',
    today: 'Hoje',
    close: 'Fechar',
    clear:'Limpar',
    max: new Date()
  };

   
  constructor(
    formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public receivesService: ReceivesService,
    public sendsService: SendsService,
    public transportersService: TransportersService,
    public toastService: MzToastService,
    public translate: TranslateService,
    public datepipe: DatePipe
  ) {
    this.form = formBuilder.group({
      send: [],
      receiveDate: ['', [
        Validators.required
      ]],
      observation: [],
      ikReturned: [],
      dateIkReturned: [],
      dateRestored: [],
      restored: [],
      transporter: [],
      canceled: [],
      canceledReason: []
    });
  }
  
  ngOnInit() {
    this.isDisabled = false;
    var uuid = this.route.params.subscribe(params => {
      var uuid = params['uuid'];
      this.title = uuid ? 'Receber Backup' : 'Editar Recepção de Backup';
      if (uuid) {
        this.isHidden = uuid ? 'hide' : 'hide';
        this.sendsService.findOneSendByUuid(uuid,"district.name,district.parent.name,transporter.transporterId,sendId,transporter.uid,district.uid,observation,transporter.phoneNumber,transporter.name,district.districtId,district.fullName,received,dateCreated,createdBy.uid,createdBy.userId,uid,backupDate,updateFinished,validationFinished,syncFinished,crossDhis2Finished,crossIdartFinished,uid,ikReceived,dateIkReceived,idartBackup,idartBackupDate")
          .subscribe(send => {
            this.send = send;
          },
            response => {
              if (response.status == 404) {
                this.router.navigate(['NotFound']);
              }
            });
            
        this.transportersService.findTransporters("", "", "", "", false,"name,phoneNumber,transporterId,uid")
          .subscribe(data => {
            this.alltransporters = data.content;
          });
      } else {
        //Edit here
        var uuidr = params['uuidr'];
        this.receivesService.findOneReceiveByUuid(uuidr,"createdBy.uid,createdBy.userId,send.sendId,transporter.transporterId,transporter.uid,transporter.name,transporter.phoneNumber,receiveId,receiveDate,ikReturned,dateIkReturned,dateCreated,dateUpdated,createdBy.personName,uid,dateRestored,canceledReason,restoredBy.personName,ikReturnedBy.personName,restored,canceled,send.observation,send.transporter.phoneNumber,send.transporter.name,send.district.fullName,send.received,send.dateUpdated,send.dateCreated,send.createdBy.personName,send.updatedBy.personName,send.uid,send.backupDate,send.updateFinished,send.validationFinished,send.syncFinished,send.crossDhis2Finished,send.crossIdartFinished,send.uid,send.ikReceived,send.dateIkReceived,send.idartBackup,send.idartBackupDate")
          .subscribe(receive => {
            this.receive = receive;
            if (this.receive.transporter != null) {
              this.transportersService.findTransporters("", "", "", "", false,"name,phoneNumber,transporterId,uid")
                .subscribe(data => {
                  this.alltransporters = data.content;
                  var filteredtransporters = this.alltransporters;
                  filteredtransporters = filteredtransporters.filter(item => item.transporterId !== this.receive.transporter.transporterId);
                  filteredtransporters.push(this.receive.transporter);
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
                });
            }
            else {
              this.transportersService.findTransporters("", "", "", "", false,"name,phoneNumber,transporterId,uid")
                .subscribe(data => {
                  this.alltransporters = data.content;
                });
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
    if (this.receive.receiveId) {
      if (new Date(userValue.receiveDate) > new Date() || new Date(userValue.dateIkReturned) > new Date()) {
        this.showMsgErr();
        this.isDisabled = false;
      } else
        if (userValue.ikReturned == true && (userValue.transporter.name == null || userValue.dateIkReturned == null || userValue.dateIkReturned == "")) {
          this.showMsgErr3();
          this.isDisabled = false;
        }
        else
          if (userValue.restored == true && (userValue.dateRestored == null)) {
            this.showMsgErr4();
            this.isDisabled = false;
          }
          else
            if (new Date(userValue.dateRestored) > new Date()) {
              this.showMsgErr2();
              this.isDisabled = false;
            }
            else
              if (this.datepipe.transform(userValue.receiveDate, 'yyyy-MM-dd') < this.datepipe.transform(new Date(this.receive.send.backupDate), 'yyyy-MM-dd') || this.datepipe.transform(userValue.dateRestored, 'yyyy-MM-dd') < this.datepipe.transform(new Date(this.receive.send.backupDate), 'yyyy-MM-dd') || this.datepipe.transform(userValue.dateIkReturned, 'yyyy-MM-dd') < this.datepipe.transform(new Date(this.receive.send.backupDate), 'yyyy-MM-dd') || this.datepipe.transform(userValue.dateIkReturned, 'yyyy-MM-dd') < this.datepipe.transform(userValue.receiveDate, 'yyyy-MM-dd') || this.datepipe.transform(userValue.dateRestored, 'yyyy-MM-dd') < this.datepipe.transform(userValue.receiveDate, 'yyyy-MM-dd')) {
                this.showMsgErrDate();
                this.isDisabled = false;
              }
              else {
                if (userValue.canceled == true && userValue.canceledReason == null) {
                  this.showMsgErr3n();
                  this.isDisabled = false;
                } else {
                  userValue.receiveId = this.receive.receiveId;
                  userValue.dateCreated = this.receive.dateCreated;
                  userValue.uid = this.receive.uid;
                  userValue.createdBy = this.receive.createdBy;
                  userValue.updatedBy = {
                    uid: user.uid,
                    userId: user.userId
                  };
                  result = this.receivesService.updateReceive(userValue);
                  result.subscribe(data => this.router.navigate(['receives']));
                }
              }
    } else {
      if (new Date(userValue.receiveDate) > new Date()) {
        this.showMsgErr();
        this.isDisabled = false;
      } else
        if (userValue.ikReturned == true && (userValue.transporter.name == null || userValue.dateIkReturned == null || userValue.dateIkReturned == "")) {
          this.showMsgErr3();
          this.isDisabled = false;
        }
        else
          if (userValue.restored == true && (userValue.dateRestored == null)) {
            this.showMsgErr4();
            this.isDisabled = false;
          }
          else
            if (new Date(userValue.dateRestored) > new Date()) {
              this.showMsgErr2();
              this.isDisabled = false;
            }
            else
              if (this.datepipe.transform(userValue.receiveDate, 'yyyy-MM-dd') < this.datepipe.transform(new Date(userValue.send.backupDate), 'yyyy-MM-dd') || this.datepipe.transform(userValue.dateRestored, 'yyyy-MM-dd') < this.datepipe.transform(new Date(userValue.send.backupDate), 'yyyy-MM-dd') || this.datepipe.transform(userValue.dateIkReturned, 'yyyy-MM-dd') < this.datepipe.transform(new Date(userValue.send.backupDate), 'yyyy-MM-dd') || this.datepipe.transform(userValue.dateIkReturned, 'yyyy-MM-dd') < this.datepipe.transform(userValue.receiveDate, 'yyyy-MM-dd') || this.datepipe.transform(userValue.dateRestored, 'yyyy-MM-dd') < this.datepipe.transform(userValue.receiveDate, 'yyyy-MM-dd')) {
                this.showMsgErrDate();
                this.isDisabled = false;
              }
              else {
                if (this.send.received == true) {
                  this.router.navigate(['receives']);
                } else {

                  userValue.createdBy = {
                    person: {
                      othersNames: user.person.othersNames,
                      surname: user.person.surname,
                      phoneNumber: user.person.phoneNumber
                    },
                    uid: user.uid,
                    userId: user.userId
                  };

                  result = this.receivesService.createReceive(userValue);
                  result.subscribe(data => this.router.navigate(['receives']));
                }

              }
    }
  }

  showMsgErr() {
    this.toastService.show('A Data do Recepção ou Devolução não deve estar no futuro!', 2000, 'red', null);
  }
  showMsgErr2() {
    this.toastService.show('A Data de Restauração não deve estar no futuro!', 2000, 'red', null);
  }
  showMsgErr3() {
    this.toastService.show('O transportador e data de devolução do Iron Key devem ser preenchidos!', 2000, 'red', null);
  }
  showMsgErr4() {
    this.toastService.show('A Data de Restauração deve ser preenchida!', 2000, 'red', null);
  }
  showMsgErrDate() {
    this.toastService.show('Verifique as datas!', 2000, 'red', null);
  }
  showMsgErr3n() {
    this.toastService.show('Escreva a razão para anular!', 2000, 'red', null);
  }
}
