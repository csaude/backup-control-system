/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit,Inject, ViewChild,forwardRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSort, MatTableDataSource, MAT_DIALOG_DATA, PageEvent,MatSnackBar } from '@angular/material';
import { SendsService } from "../sends/shared/sends.service";
import { Send } from "../sends/shared/send";
declare var jsPDF: any; // Important
import { DatePipe } from '@angular/common';
import { Receive } from '../receives/shared/receive';
import { ReceivesService } from '../receives/shared/receives.service';
import { DistrictsService } from './../districts/shared/districts.service';
import { District } from './../districts/shared/district';
import { TranslateService } from 'ng2-translate';
import * as myGlobals from '../../globals';
import {ExcelService} from '../resources/shared/excel.service';

export class ReportObj{
  districtname:string;
  Distrito:string;
  Observacao:string;
}

@Component({
  selector: 'app-receives',
  templateUrl: './receives.component.html',
  styleUrls: ['./receives.component.css']
})

/** 
* @author Damasceno Lopes
*/
export class ReceivesComponent implements OnInit {
  public sends;sends1: Send[] = [];
  public send: Send = new Send();
  public receives;receives1: Receive[] = [];

  public receivesreport: ReportObj[];

  public receive: Receive = new Receive();
  public from; until; district_id;idart;
  public alldistricts: District[] = [];
  public form: FormGroup;
  public received; canceled: boolean;
  public ROLE_SIS; ROLE_IT; ROLE_OA; ROLE_GMA; ROLE_ODMA; ROLE_ORMA; ROLE_GDD; isHidden; isHidden2m: string;
  public user: Object[] = [];

  public maxDate=new Date();


  public pageSize: number;
  public page: number;
  // MatPaginator Output
  public pageEvent: PageEvent;
  public displayedColumns: string[] = ['district','backup_date','idart_backup_date','received','updated','actions'];
  public displayedColumns2: string[] = ['district','backup_date','idart_backup_date','received','restored','updated','actions'];
  @ViewChild(MatSort) sort: MatSort;

  public total; totali: number = 0;

  constructor(private excelService:ExcelService,public datepipe: DatePipe, public sendsService: SendsService, public receivesService: ReceivesService,
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
   
    
    this.canceled = false;
    this.from = "";
    this.until = "";
    this.district_id = "";
    this.idart = "";
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');

    this.page=0;
    this.pageSize=10;
    if(window.sessionStorage.getItem('received')){
      this.received = true;
      this.getPageReceive(1);
    }else{
      this.received = false;
      this.getPageSend(1);
      
    }

    this.districtsService.findDistricts("", "", "", "", "fullName,uid,districtId,canceled")
      .subscribe(data => {
        this.alldistricts = data.content;
      });
     
  }

  getPageSend(event) {

    if(event!=null){
      if(event.pageIndex||event.pageSize){
      this.page=event.pageIndex;
      this.pageSize=event.pageSize;
      }
    }
    this.isHidden = "";
    this.sendsService.findAllSends(this.page+1, this.pageSize, this.received, this.canceled,this.idart, this.from, this.until, this.district_id, "createdBy.phoneNumber,updatedBy.phoneNumber,observation,transporter.phoneNumber,transporter.role,transporter.name,district.fullName,received,dateUpdated,dateCreated,createdBy.personName,updatedBy.personName,uid,backupDate,updateFinished,validationFinished,syncFinished,crossDhis2Finished,crossIdartFinished,uid,ikReceived,dateIkReceived,idartBackup,idartBackupDate")
      .subscribe(data => {
        this.total = data.totalElements;
        this.sends1 = data.content;
        this.sends = new MatTableDataSource(this.sends1);
        
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

  getPageReceive(event) {

    if(event!=null){
      if(event.pageIndex||event.pageSize){
      this.page=event.pageIndex;
      this.pageSize=event.pageSize;
      }
    }
    this.isHidden = "";
    this.receivesService.findAllReceives(this.page+1, this.pageSize, this.canceled,this.idart, this.from, this.until, this.district_id, "observation,send.createdBy.phoneNumber,createdBy.phoneNumber,updatedBy.phoneNumber,transporter.name,transporter.phoneNumber,transporter.role,receiveId,receiveDate,ikReturned,dateIkReturned,dateCreated,dateUpdated,createdBy.personName,uid,dateRestored,canceledReason,restoredBy.personName,ikReturnedBy.personName,restored,canceled,send.observation,send.transporter.phoneNumber,send.transporter.name,send.district.fullName,send.received,send.dateUpdated,send.dateCreated,send.createdBy.personName,send.updatedBy.personName,send.uid,send.backupDate,send.updateFinished,send.validationFinished,send.syncFinished,send.crossDhis2Finished,send.crossIdartFinished,send.uid,send.ikReceived,send.dateIkReceived,send.idartBackup,send.idartBackupDate")
      .subscribe(data => {
        this.total = data.totalElements;
        this.receives1 = data.content;
        this.receives = new MatTableDataSource(this.receives1);
       
      },
        error => {
          this.isHidden = "hide";
          this.total = 0;
          this.receives = [];
          this.receives1 = [];
        },
        () => {
          this.isHidden = "hide";
        }
      );
  }

  printSend1(uuid){
    this.isHidden = "";
    this.send = this.sends1.find(item => item.uid == uuid);
    this.printSend();
  }

  printSend2(uid) {
    this.isHidden = "";
    this.receive = this.receives1.find(item => item.uid == uid);
    this.send = this.receive.send;
    this.printSend();
  }

  printSend() {
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
    doc.text(this.send.createdBy.personName+" ("+this.send.createdBy.phoneNumber+")", 30, 185);
    doc.setFontSize(12);
    doc.text('_______________________________', 30, 200);
    doc.setFontSize(11);
    doc.text(this.send.transporter.name +" ("+this.send.transporter.phoneNumber+")", 30, 205);
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
    doc.save('SCB_Protocolo_Envio_' + this.send.district.name + '_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm') + '.pdf');
    this.isHidden = "hide";
  }

  setSend(uuid) {
    this.send = this.sends1.find(item => item.uid == uuid);
    this.openDialog();
    }

  

  setReceive(uid) {
    this.receive = this.receives1.find(item => item.uid == uid);
    this.openDialog2();
  }
  
  search() {
    var userValue = this.form.value;


    if (userValue.district == "all" || userValue.district == null) {
      this.district_id = "";
    } else {
      this.district_id = userValue.district;
    }

    if (userValue.idart == null || userValue.idart == false) {
      this.idart = "";
    } else {
      this.idart = true;
    }

    if ((userValue.backup_from != "" && userValue.backup_from != null) && (userValue.backup_until != "" && userValue.backup_until != null)) {
      if (userValue.backup_from <= userValue.backup_until) {
        this.from = this.datepipe.transform(userValue.backup_from, 'yyyyMMdd');
        this.until = this.datepipe.transform(userValue.backup_until, 'yyyyMMdd');
      } else {
        this.from = "";
        this.until = "";
      }
    } else {
      this.from = "";
      this.until = "";
    }

    if (userValue.received == null || userValue.received == false) {
      this.received = false;
      window.sessionStorage.removeItem('received');
      this.page=0;
      this.getPageSend(1);
    } else {
      this.received = true;
      window.sessionStorage.setItem('received', 'true');
      this.page=0;
      this.getPageReceive(1);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '800px',
      height: '600px',
      data: this.send
    });

  }

  openDialog2(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog2, {
      width: '800px',
      height: '600px',
      data: this.receive
    });

  }

  search2() {

    var userValue = this.form.value;
    
    if ((userValue.backup_from != "" && userValue.backup_from != null) && (userValue.backup_until != "" && userValue.backup_until != null)) {
      if (userValue.backup_from <= userValue.backup_until) {
        this.from = this.datepipe.transform(userValue.backup_from, 'yyyyMMdd');
        this.until = this.datepipe.transform(userValue.backup_until, 'yyyyMMdd');
        if (userValue.received == null || userValue.received == false) {
          this.getPageSend(1);
        } else {
          this.getPageReceive(1);
        }
      } else {
        this.from = "";
        this.until = "";
      }
    } else if ((userValue.backup_from == "" || userValue.backup_from == null) && (userValue.backup_until == "" || userValue.backup_until == null)) {
      this.from = "";
      this.until = "";
      if (userValue.received == null || userValue.received == false) {
        this.getPageSend(1);
      } else {
        this.getPageReceive(1);
      }
    }
    else{
      this.from = "";
      this.until = "";
    }

  }

  printList() {
    this.isHidden = "";
    var total;

    alasql.fn.datetime = function (dateStr) {
      var date = new Date(dateStr);
      return ("0" + date.getDate()).slice(-2)+"/"+("0" + (date.getMonth()+1)).slice(-2)+"/"+date.getFullYear();
      ;
    };


    this.receivesService.findAllReceives(1, 1000, this.canceled,this.idart, this.from, this.until, this.district_id, "createdBy.personName,send.observation,send.district.fullName,send.createdBy.personName,send.backupDate,send.updateFinished,send.validationFinished,send.syncFinished,send.crossDhis2Finished,send.crossIdartFinished,send.dateCreated,dateCreated,send.idartBackupDate")
      .subscribe(data => {
        this.receivesreport = data.content;
        this.receivesreport = alasql("SELECT CONCAT(createdBy->personName,'\n',datetime(dateCreated)) AS receiver ,send->observation AS obsd,send->district->fullName AS districtname,CONCAT(send->createdBy->personName,'\n',datetime(send->dateCreated)) AS sender,CONCAT(datetime(send->backupDate),'\n',CASE WHEN send->idartBackupDate IS NOT NULL THEN CONCAT('iDART: ',datetime(send->idartBackupDate)) ELSE '' END) AS backup_date_f,CASE WHEN send->updateFinished==true THEN 'Sim' ELSE 'Não' END AS at ,CASE WHEN send->validationFinished==true THEN 'Sim' ELSE 'Não' END AS vt, CASE WHEN send->syncFinished==true THEN 'Sim' ELSE 'Não' END AS st, CASE WHEN send->crossDhis2Finished==true THEN 'Sim' ELSE 'Não' END AS dhis2,CASE WHEN send->crossIdartFinished==true THEN 'Sim' ELSE 'Não' END AS idart FROM ?receivesreport", [this.receivesreport])
        total = data.content.length;

        if (this.district_id == '') {
         
          this.alldistricts =this.alldistricts.filter(item => item.canceled==false);
          for (let d of this.alldistricts) {
            if (!this.receivesreport.find(item => item.districtname == d.fullName)) {
              let receive = new Receive();
              receive.districtname = d.fullName
              receive.obsd = "Sem registo.";
              this.receivesreport.push(receive);
            }
          }
        }
      },
        error => {
          this.isHidden = "hide";
          this.receivesreport = [];
        },
        () => {
          this.isHidden = "hide";

          var user = JSON.parse(window.sessionStorage.getItem('user'));
          var doc = new jsPDF('landscape');
          var totalPagesExp = "{total_pages_count_string}";
          var columns = [
            { title: "Distrito/US", dataKey: "districtname" },
            { title: "Data do\nBackup", dataKey: "backup_date_f" },
            { title: "Actualização\nTerminada?", dataKey: "at" },
            { title: "Sincronização\nTerminada?", dataKey: "st" },
            { title: "Cruzamento\ncom DHIS2?", dataKey: "dhis2" },
            { title: "Cruzamento\ncom iDART?", dataKey: "idart" },
            { title: "Validação\nTerminada?", dataKey: "vt" },
            { title: "Enviado\npor", dataKey: "sender" },
            { title: "Observação Distrital", dataKey: "obsd" },
            { title: "Recebido\npor", dataKey: "receiver" }

          ];
          var listSize = total;
          var datenow = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');

          // HEADER
          doc.setFontSize(18);
          doc.text('Lista de Backups Recebidos', 14, 22);
          doc.setFontSize(14);
          doc.text(listSize + ' backups, efectuados de ' + this.getDate(this.from) + ' até ' + this.getDate(this.until) + '.', 14, 45);
          doc.setFontSize(11);
          doc.setTextColor(100);
          var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
          var text = doc.splitTextToSize('Backups efectuados num determinado periodo enviados para Quelimane e que foram recebidos pelo SIS.', pageWidth - 25, {});
          doc.text(text, 14, 32);

          var pageContent = function (data) {
            // FOOTER
            var str = "Página " + data.pageCount;
            if (typeof doc.putTotalPages === 'function') {
              str = str + " de " + totalPagesExp;
            }
            doc.setFontSize(10);
            var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
            doc.text(str, data.settings.margin.left, pageHeight - 5);
          };
          doc.autoTable(columns, this.receivesreport, {
            startY: 50,
            styles: { overflow: 'linebreak' },
            bodyStyles: { valign: 'top' },
            columnStyles: {
              districtname: { columnWidth: 35, fontSize: 10 },
              backup_date_f: { columnWidth: 23, fontSize: 10 },
              at: { columnWidth: 25 },
              st: { columnWidth: 27 },
              dhis2: { columnWidth: 24 },
              idart: { columnWidth: 25 },
              vt: { columnWidth: 24 },
              sender: { columnWidth: 23, fontSize: 10 },
              obsd: { columnWidth: 40, fontSize: 10 },
              receiver: { columnWidth: 23, fontSize: 10 },


            },
            theme: 'grid',
            headerStyles: { fillColor: [41, 128, 185], lineWidth: 0 },
            addPageContent: pageContent

          });
          doc.setFontSize(11);
          doc.setTextColor(100);
          doc.text('Lista impressa em: ' + datenow + ', por: ' + user.person.othersNames + ' ' + user.person.surname + '.', 14, doc.autoTable.previous.finalY + 10);
          doc.setTextColor(0, 0, 200);
          doc.textWithLink('© Sistema de Controle de Backup', 14, doc.autoTable.previous.finalY + 15, { url: myGlobals.Production_URL });

          if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
          }
          doc.save('SCB_Lista de Backups recebidos_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm') + '.pdf');

        }
      );
  }



  printListExcel() {
    this.isHidden = "";
    var total;

    alasql.fn.datetime = function (dateStr) {
      var date = new Date(dateStr);
      return ("0" + date.getDate()).slice(-2)+"/"+("0" + (date.getMonth()+1)).slice(-2)+"/"+date.getFullYear();
      ;
    };


    this.receivesService.findAllReceives(1, 1000, this.canceled,this.idart, this.from, this.until, this.district_id, "dateRestored,receiveDate,createdBy.personName,send.observation,send.district.fullName,send.createdBy.personName,send.backupDate,send.updateFinished,send.validationFinished,send.syncFinished,send.crossDhis2Finished,send.crossIdartFinished,send.dateCreated,dateCreated,send.idartBackupDate")
      .subscribe(data => {
        this.receivesreport = data.content;
        this.receivesreport = alasql("SELECT send->district->fullName AS Distrito,datetime(send->backupDate) AS [Data do Backup OpenMRS],  CASE WHEN send->idartBackupDate IS NOT NULL THEN datetime(send->idartBackupDate) ELSE '' END AS [Data do Backup iDART],CASE WHEN send->updateFinished==true THEN 'Sim' ELSE 'Não' END AS [Actualização Terminada?] ,CASE WHEN send->validationFinished==true THEN 'Sim' ELSE 'Não' END AS [Validação Terminada?], CASE WHEN send->syncFinished==true THEN 'Sim' ELSE 'Não' END AS [Sincronização Terminada?], CASE WHEN send->crossDhis2Finished==true THEN 'Sim' ELSE 'Não' END AS [Cruzamento com DHIS2?],CASE WHEN send->crossIdartFinished==true THEN 'Sim' ELSE 'Não' END AS [Cruzamento com iDART?], send->createdBy->personName AS [Enviado por], datetime(send->dateCreated) AS [Enviado em], send->observation AS [Observacao], createdBy->personName AS [Recebido por], datetime(receiveDate) AS [Recebido em], CASE WHEN dateRestored IS NOT NULL THEN datetime(dateRestored) ELSE '' END AS [Restaurado em], observation AS [Observação SIS]  FROM ?receivesreport", [this.receivesreport])


        if (this.district_id == '') {
         
          this.alldistricts =this.alldistricts.filter(item => item.canceled==false);
          for (let d of this.alldistricts) {
            if (!this.receivesreport.find(item => item.Distrito == d.fullName)) {
              let receive = new ReportObj();
              receive.Distrito = d.fullName
              receive.Observacao = "Sem registo.";
              this.receivesreport.push(receive);
            }
          }
        }
      },
        error => {
          this.isHidden = "hide";
          this.receivesreport = [];
        },
        () => {
          this.isHidden = "hide";
          console.log()
          this.excelService.exportAsExcelFile(this.receivesreport, 'SCB_Backups recebidos_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
          
        }
      );
  }



  getDate(str: any){
    if(str!=""){
    return str.charAt(6)+""+str.charAt(7)+"/"+str.charAt(4)+""+str.charAt(5)+"/"+str.charAt(0)+""+str.charAt(1)+str.charAt(2)+""+str.charAt(3);
    }else{
      return "";
    }
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

@Component({
  selector: 'receives-info-dialog',
  templateUrl: 'receives-info-dialog.html',
})
export class DialogOverviewExampleDialog2 {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog2>,
    @Inject(MAT_DIALOG_DATA) public data: Receive) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

