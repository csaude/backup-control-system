/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit,Inject, ViewChild,forwardRef } from '@angular/core';
import { FormBuilder, FormGroup,NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSort, MatTableDataSource, MAT_DIALOG_DATA, PageEvent,MatSnackBar } from '@angular/material';
import { SendsService } from "./shared/sends.service";
import { Send } from "./shared/send";
import * as jsPDF from "jspdf";
import { DatePipe } from '@angular/common';
import { Receive } from '../receives/shared/receive';
import { ReceivesService } from '../receives/shared/receives.service';
import { DistrictsService } from '../districts/shared/districts.service';
import { District } from '../districts/shared/district';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-sends',
  templateUrl: './sends.component.html',
  styleUrls: ['./sends.component.css']
})

/** 
* @author Damasceno Lopes
*/
export class SendsComponent implements OnInit {
  public ROLE_SIS; ROLE_IT; ROLE_OA; ROLE_GMA; ROLE_ODMA; ROLE_ORMA; ROLE_GDD;isHidden; isHidden2m: string;
  public sends;sends1: Send[] = [];
  public send: Send = new Send();
  public receive: Receive = new Receive();
  public from; until;district_id;
  public alldistricts: District[] = [];
  public form: FormGroup;
  public received; canceled; idart;
  public user: Object[] = []; 

  public maxDate=new Date();

  public total; totali; number = 0;

  public pageSize: number;
  public page: number;
  // MatPaginator Output
  public pageEvent: PageEvent;
  public displayedColumns: string[] = ['district','backup_date','idart_backup_date','received','updated','actions'];
  @ViewChild(MatSort) sort: MatSort;

  constructor(public datepipe: DatePipe, public sendsService: SendsService, public receivesService: ReceivesService,
    public translate: TranslateService, public districtsService: DistrictsService, formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
    this.form = formBuilder.group({
      district: [],
      backup_from: [],
      backup_until: [],
      received: [],
      idart: []
    });
  }
  ngOnInit() {
    this.isHidden = "";
    this.received = false;
    this.canceled = false;
    this.idart = "";
    this.page=0;
    this.pageSize=10;
    this.from="";
    this.until="";
    this.district_id="";
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');


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
    this.getPage(1);
  }

  getPage(event) {

    if(event!=null){
      if(event.pageIndex||event.pageSize){
      this.page=event.pageIndex;
      this.pageSize=event.pageSize;
      }
    }
    this.isHidden = "";
    this.sendsService.findSends(this.page+1, this.pageSize, this.received, this.canceled,this.idart, this.from, this.until, this.district_id,"transporter.role,transporter.canceledReason,createdBy.phoneNumber,updatedBy.phoneNumber,observation,transporter.phoneNumber,transporter.name,district.fullName,received,dateUpdated,dateCreated,createdBy.personName,updatedBy.personName,uid,backupDate,updateFinished,validationFinished,syncFinished,crossDhis2Finished,crossIdartFinished,uid,ikReceived,dateIkReceived,idartBackup,idartBackupDate")
      .subscribe(data => {
        this.total = data.totalElements;
        this.sends1 = data.content;
        this.sends = new MatTableDataSource(this.sends1);
        this.sends.sort = this.sort;
      },
        error => {
          this.isHidden = "hide";
          this.total = 0;
          this.sends = [];
          this.sends1 = [];
        },
        () => {
          this.isHidden = "hide";
        }
      );
  }
  deleteSend(send) {
    if (confirm("Deseja realmente excluir " + send.name + "?")) {
      var index = this.sends.indexOf(send);
      this.sends.splice(index, 1);
      this.sendsService.deleteSend(send.send_id)
        .subscribe(null,
          err => {
            alert("Could not delete send.");
            // Revert the view back to its original state
            this.sends.splice(index, 0, send);
          }
        );
    }
  }

  printSend(uuid) {
    this.isHidden = "";
    this.send = this.sends1.find(item => item.uid == uuid);
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    var doc = new jsPDF();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Impresso em: ' + this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm'), 200, 5, null, null, 'right');
    doc.setDrawColor(0);
    doc.setFillColor(2, 136, 209);
    doc.rect(30, 25, 150, 10, 'F')
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('Protocolo de Envio de Backup', 70, 31);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);

  
    var idart="";

    if(this.send.idartBackup){
      idart=", iDART: "+this.datepipe.transform(this.send.idartBackupDate, 'dd/MM/yyyy');
    }

    doc.text(this.send.district.fullName, 40, 55);
    doc.setDrawColor(0);
    doc.setFillColor(243, 243, 243);
    doc.rect(40, 60, 65, 8, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Data do Backup OpenMRS:', 49, 65);
    doc.text(this.datepipe.transform(this.send.backupDate, 'dd/MM/yyyy')+idart, 110, 65);
    doc.setDrawColor(0);
    doc.setFillColor(243, 243, 243);
    doc.rect(40, 70, 65, 8, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Actualização Terminada?', 49, 75);
    if (this.send.updateFinished == true) {
      doc.text('Sim', 110, 75);
    } else {
      doc.text('Não', 110, 75);
    }
    doc.setDrawColor(0);
    doc.setFillColor(243, 243, 243);
    doc.rect(40, 80, 65, 8, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Sincronização Terminada?', 49, 85);
    if (this.send.syncFinished == true) {
      doc.text('Sim', 110, 85);
    } else {
      doc.text('Não', 110, 85);
    }
    doc.setDrawColor(0);
    doc.setFillColor(243, 243, 243);
    doc.rect(40, 90, 65, 8, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Cruzamento com DHIS2?', 49, 95);
    if (this.send.crossDhis2Finished == true) {
      doc.text('Sim', 110, 95);
    } else {
      doc.text('Não', 110, 95);
    }
    doc.setDrawColor(0);
    doc.setFillColor(243, 243, 243);
    doc.rect(40, 100, 65, 8, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Cruzamento com iDART?', 49, 105);
    if (this.send.crossIdartFinished == true) {
      doc.text('Sim', 110, 105);
    } else {
      doc.text('Não', 110, 105);
    }
    doc.setDrawColor(0);
    doc.setFillColor(243, 243, 243);
    doc.rect(40, 110, 65, 8, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Validação Terminada?', 49, 115);
    if (this.send.validationFinished == true) {
      doc.text('Sim', 110, 115);
    } else {
      doc.text('Não', 110, 115);
    }
    doc.setDrawColor(0);
    doc.setFillColor(243, 243, 243);
    doc.rect(40, 120, 65, 8, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Observação Distrital:', 49, 125);
    doc.setFontSize(12);
    var splitTitle = doc.splitTextToSize(this.send.observation, 72);
    doc.text(splitTitle, 110, 125);
    doc.text('_______________________________', 30, 180);
    doc.setFontSize(11);
    doc.text(user.person.othersNames+" "+user.person.surname +" ("+user.person.phoneNumber+")", 30, 185);
    doc.setFontSize(12);
    doc.text('_______________________________', 30, 200);
    doc.setFontSize(11);
    doc.text(this.send.transporter.name+" ("+this.send.transporter.phoneNumber+")", 30, 205);
    doc.setFontSize(12);
    doc.text('_______________________________', 30, 220);
    doc.text('Oficial de SIS', 30, 225);
    doc.text('Data: ___/ ___/ ____', 140, 180);
    doc.text('Data: ___/ ___/ ____', 140, 200);
    doc.text('Data: ___/ ___/ ____', 140, 220);

    doc.setDrawColor(0);
    doc.setFillColor(2, 136, 209);
    doc.rect(30, 250, 150, 15, 'F')
    doc.setFontSize(12);
    doc.setTextColor(0, 255, 255);
    doc.textWithLink('Sistema de Controle de Backup', 75, 256, { url: 'http://196.28.230.195:8080/scb' });
    doc.setTextColor(255, 255, 255);
    doc.textWithLink('Mantido por: his@fgh.org.mz', 77, 261, { url: 'mailto:his@fgh.org.mz' });
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.save('SCB_Protocolo de Envio de Backup_' + this.send.district.name + '_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm') + '.pdf');
    this.isHidden = "hide";
  }

  search2() {

    var userValue = this.form.value;
    
    if ((userValue.backup_from != "" && userValue.backup_from != null) && (userValue.backup_until != "" && userValue.backup_until != null)) {
      if (userValue.backup_from <= userValue.backup_until) {
        this.from = this.datepipe.transform(userValue.backup_from, 'yyyyMMdd');
        this.until = this.datepipe.transform(userValue.backup_until, 'yyyyMMdd');
        this.page=0;
        this.getPage(1);
      } else {
        this.from = "";
        this.until = "";
      }
    } else if ((userValue.backup_from == "" || userValue.backup_from == null) && (userValue.backup_until == "" || userValue.backup_until == null)) {
      this.from = "";
      this.until = "";
      this.page=0;
      this.getPage(1);
    }
    else{
      this.from = "";
      this.until = "";
    }

  }

  setSend(uuid) {
    this.send = this.sends1.find(item => item.uid == uuid);
    this.isHidden2m="hide";
    if (this.send.received == true) {
      this.isHidden2m="";
      this.receivesService.findOneReceiveBySendUuid(uuid,"createdBy.phoneNumber,updatedBy.phoneNumber,createdBy.uid,createdBy.userId,send.sendId,transporter.transporterId,transporter.uid,transporter.name,transporter.phoneNumber,receiveId,receiveDate,ikReturned,dateIkReturned,dateCreated,dateUpdated,createdBy.personName,uid,dateRestored,canceledReason,restoredBy.personName,ikReturnedBy.personName,restored")
        .subscribe(data => {
          this.receive = data;
          if (this.receive != null) {
            this.send.receivername = this.receive.createdBy.personName;
            this.send.receivedate = this.receive.receiveDate;
            this.send.receivernumber = this.receive.createdBy.phoneNumber;
            this.send.restored = this.receive.restored;
            if (this.receive.restoredBy != null) {
              this.send.restorername = this.receive.restoredBy.personName;
            }
            this.send.date_restored = this.receive.dateRestored;
            this.send.sis_observation = this.receive.observation;
            this.send.ik_returned = this.receive.ikReturned;
            if (this.send.ik_returned) {
              this.send.ik_returneddate = this.receive.dateIkReturned;
              this.send.ik_returnedto = this.receive.transporter.name;
            }
          }
        }, error => {
        },
          () => {
            this.isHidden2m="hide"; this.openDialog();
          });
    } else {
      this.isHidden2m="hide";
      this.openDialog();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '800px',
      height: '600px',
      data: this.send
    });

  }

  search() {
    var userValue = this.form.value;
    if (userValue.received == null || userValue.received == false) {
      this.received = false;
    } else {
      this.received = true;
    }

    if (userValue.idart == null || userValue.idart == false) {
      this.idart = "";
    } else {
      this.idart = true;
    }

    if (userValue.district == "all" || userValue.district == null) {
      this.district_id = "";
    } else {
      this.district_id = userValue.district;
    }

    if ((userValue.backup_from != "" && userValue.backup_from != null) && (userValue.backup_until != "" && userValue.backup_until != null)) {
      if (userValue.backup_from <= userValue.backup_until) {
        this.from = this.datepipe.transform(userValue.backup_from, 'yyyyMMdd');
        this.until = this.datepipe.transform(userValue.backup_until, 'yyyyMMdd');
      }else{
        this.from = "";
        this.until = "";
      }
    }else{
      this.from = "";
      this.until = "";
    }
    this.page=0;
    this.getPage(1);
   
  }


}

@Component({
  selector: 'sends-info-dialog',
  templateUrl: 'sends-info-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Send) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
