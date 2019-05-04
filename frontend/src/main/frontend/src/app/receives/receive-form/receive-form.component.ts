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
import { TranslateService } from 'ng2-translate';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar} from '@angular/material';

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
  public title;name: string;
  public isHidden: string;
  public isDisabled: boolean;
  public receive: Receive = new Receive();
  public send: Send = new Send();
  public openFunctionCallback; closeFunctionCallback;
  public alltransporters: Transporter[] = [];
  public disabled1: boolean;
  public nameValueControl = new FormControl();
  public formCtrlSub: Subscription;
  public maxDate=new Date();
   
  constructor(
    formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    public receivesService: ReceivesService,
    public sendsService: SendsService,
    public transportersService: TransportersService,
    public snackBar: MatSnackBar,
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
      canceledReason: [],
      sendCanceled: [],
      sendCanceledReason: []
    });
  }

  
  
  ngOnInit() {
this.name="";
  
    this.disabled1 = true;
    this.isDisabled = false;
    var uuid = this.route.params.subscribe(params => {
      var uuid = params['uuid'];
      this.title = uuid ? 'Receber Backup' : 'Editar Recepção de Backup';
      if (uuid) {
        this.isHidden = uuid ? 'hide' : 'hide';
        this.sendsService.findOneSendByUuid(uuid,"district.fullName,transporter.transporterId,sendId,transporter.uid,district.uid,observation,transporter.phoneNumber,transporter.name,district.districtId,district.fullName,received,dateCreated,createdBy.uid,createdBy.userId,uid,backupDate,updateFinished,validationFinished,syncFinished,crossDhis2Finished,crossIdartFinished,uid,ikReceived,dateIkReceived,idartBackup,idartBackupDate")
          .subscribe(send => {
            this.send = send;
          },
            response => {
              if (response.status == 404) {
                this.router.navigate(['NotFound']);
              }
            });
            
            this.transportersService.findTransporters(1, 20, this.name, "", false,"name,phoneNumber,transporterId,uid,role")
            .subscribe(data => { 
              this.alltransporters = data.content;
              this.alltransporters=this.alltransporters.filter(item => item.transporterId !== this.send.transporter.transporterId);
            
            }
              , errot => {
                this.disabled1 = false;
                this.alltransporters = []
               },
              () => {
                this.disabled1 = false;
              }
            );
          
      } else {
        //Edit here
        var uuidr = params['uuidr'];
        this.receivesService.findOneReceiveByUuid(uuidr,"observation,createdBy.uid,createdBy.userId,send.sendId,transporter.transporterId,transporter.uid,transporter.name,transporter.phoneNumber,receiveId,receiveDate,ikReturned,dateIkReturned,dateCreated,dateUpdated,createdBy.personName,uid,dateRestored,canceledReason,restoredBy.personName,ikReturnedBy.personName,restored,canceled,send.observation,send.transporter.phoneNumber,send.transporter.name,send.district.fullName,send.received,send.dateUpdated,send.dateCreated,send.createdBy.personName,send.updatedBy.personName,send.uid,send.backupDate,send.updateFinished,send.validationFinished,send.syncFinished,send.crossDhis2Finished,send.crossIdartFinished,send.uid,send.ikReceived,send.dateIkReceived,send.idartBackup,send.idartBackupDate")
          .subscribe(receive => {
            this.receive = receive;
            this.receive.receiveDate=new Date(this.receive.receiveDate);
if(this.receive.restored){
  this.receive.dateRestored=new Date(this.receive.dateRestored);
}

            if (this.receive.transporter != null) {
              this.receive.dateIkReturned=new Date(this.receive.dateIkReturned);
              
              this.transportersService.findTransporters(1, 20, this.name, "", false,"name,phoneNumber,transporterId,uid,role")
          .subscribe(data => { 
            this.alltransporters = data.content;
            this.alltransporters=this.alltransporters.filter(item => item.transporterId !== this.send.transporter.transporterId);

            this.alltransporters.push(this.receive.transporter);
              this.alltransporters = this.alltransporters.sort(function (a, b) {
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
          
          }
            , errot => {
              this.disabled1 = false;
              this.alltransporters = []
             },
            () => {
              this.disabled1 = false;
            }
          );


            }
            else {
              this.transportersService.findTransporters(1, 20, this.name, "", false,"name,phoneNumber,transporterId,uid,role")
              .subscribe(data => { 
                this.alltransporters = data.content;
                this.alltransporters=this.alltransporters.filter(item => item.transporterId !== this.send.transporter.transporterId);
              
              }
                , errot => {
                  this.disabled1 = false;
                  this.alltransporters = []
                 },
                () => {
                  this.disabled1 = false;
                }
              );
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
      userValue.send=this.receive.send;
      if (new Date(userValue.receiveDate) > new Date()) {
        this.openSnackBar("A Data do Recepção não deve estar no futuro!", "OK");
        this.isDisabled = false;
      } else
        if (userValue.ikReturned == true && (!userValue.transporter || userValue.dateIkReturned == null || userValue.dateIkReturned == "")) {
          this.openSnackBar("O transportador e data de devolução do Iron Key devem ser preenchidos!", "OK");
          this.isDisabled = false;
        }
        else
          if (userValue.restored == true && (userValue.dateRestored == null)) {
            this.openSnackBar("A Data de Restauração deve ser preenchida!", "OK");
            this.isDisabled = false;
          }
          else
            if (new Date(userValue.dateRestored) > new Date()) {
              this.openSnackBar("A Data de Restauração não deve estar no futuro!", "OK");
              this.isDisabled = false;
            }
            else
            if (new Date(userValue.receiveDate) < new Date(userValue.send.backupDate) || ( userValue.dateIkReturned && new Date(userValue.dateIkReturned) < new Date(userValue.receiveDate))  || ( userValue.dateRestored && (new Date(userValue.dateRestored) < new Date(userValue.receiveDate))) ) {
                this.openSnackBar("Verifique as datas!", "OK");
                this.isDisabled = false;
              }
              else {
                if (userValue.canceled == true && userValue.canceledReason == null) {
                  this.openSnackBar("Escreva a razão para anular!", "OK");
                  this.isDisabled = false;
                }else if (userValue.ikReturned == true &&userValue.transporter&&!userValue.transporter.name) {
                  this.openSnackBar("Transportador inválido!", "OK");
                  this.isDisabled = false;
                }
              
                else {
                  
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
      userValue.send=this.send;

      if (userValue.sendCanceled == true && userValue.sendCanceledReason == null) {
        this.openSnackBar("Escreva a razão para anular!", "OK");
        this.isDisabled = false;
      }else if (new Date(userValue.receiveDate) > new Date()) {
        this.openSnackBar("A Data do Recepção estar no futuro!", "OK");
        this.isDisabled = false;
      } else
        if (userValue.ikReturned == true && (!userValue.transporter || userValue.dateIkReturned == null || userValue.dateIkReturned == "")) {
          this.openSnackBar("O transportador e data de devolução do Iron Key devem ser preenchidos!", "OK");
          this.isDisabled = false;
        }
        else
          if (userValue.restored == true && (userValue.dateRestored == null)) {
            this.openSnackBar("A Data de Restauração deve ser preenchida!", "OK");
            this.isDisabled = false;
          }         
            else
              if (new Date(userValue.receiveDate) < new Date(userValue.send.backupDate) || (userValue.dateIkReturned && new Date(userValue.dateIkReturned) < new Date(userValue.receiveDate))|| (userValue.dateRestored && new Date(userValue.dateRestored) < new Date(userValue.receiveDate))) {
                this.openSnackBar("Verifique as datas!", "OK");
                this.isDisabled = false;
              }
              else {
                if (this.send.received == true) {
                  this.router.navigate(['receives']);
                } 
                
                else if (userValue.ikReturned == true &&userValue.transporter&&!userValue.transporter.name) {
                  this.openSnackBar("Transportador inválido!", "OK");
                  this.isDisabled = false;
                }
                else {
                  
                  userValue.createdBy = {
                    person: {
                      othersNames: user.person.othersNames,
                      surname: user.person.surname,
                      phoneNumber: user.person.phoneNumber
                    },
                    uid: user.uid,
                    userId: user.userId
                  };
                  userValue.send.canceled=userValue.sendCanceled;
                  userValue.send.canceledReason=userValue.sendCanceledReason;

                  result = this.receivesService.createReceive(userValue);
                  result.subscribe(data => this.router.navigate(['receives']));
                }

              }
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

  displayFn(transporter: Transporter): string {
    if(transporter)
    return transporter.name;
}

  search(searchValue : string){
    this.disabled1 = true;
    this.transportersService.findTransporters(1, 20, searchValue, "", false,"name,phoneNumber,transporterId,uid,role")
          .subscribe(data => { this.alltransporters = data.content; }
            , errot => {
              this.disabled1 = false;
              this.alltransporters = []
             },
            () => {
              this.disabled1 = false;
            }
          );
  }

}
