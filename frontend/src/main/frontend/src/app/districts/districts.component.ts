/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSnackBar, MatSort, MatTableDataSource, MAT_DIALOG_DATA, PageEvent } from '@angular/material';
import * as alasql from 'alasql';
import { TranslateService } from 'ng2-translate';
import 'rxjs/add/operator/debounceTime';
import { Subscription } from 'rxjs/Subscription';
import * as myGlobals from '../../globals';
import { Evaluation } from '../evaluations/shared/evaluation';
import { EvaluationsService } from '../evaluations/shared/evaluations.service';
import { Receive } from '../receives/shared/receive';
import { ReceivesService } from '../receives/shared/receives.service';
import { ResourcesService } from "./../resources/shared/resources.service";
import { Send } from "./../sends/shared/send";
import { SendsService } from "./../sends/shared/sends.service";
import { Sync } from "./../syncs/shared/sync";
import { SyncsService } from "./../syncs/shared/syncs.service";
import { District } from "./shared/district";
import { DistrictsService } from "./shared/districts.service";

declare var jsPDF: any;

@Component({
  selector: 'app-districts',
  templateUrl: './districts.component.html',
  styleUrls: ['./districts.component.css']
})

/** 
* @author Damasceno Lopes
*/
export class DistrictsComponent implements OnInit {

  public districts;districts1; districtsreport; alldistricts: District[] = [];
  public district: District = new District();
  public send: Send = new Send();
  public sends: Send[] = [];
  public receive: Receive = new Receive();
  public evaluations: Evaluation[] = [];
  public evaluation: Evaluation = new Evaluation();
  public syncs: Sync[] = [];
  public sync: Sync = new Sync();
 
  public isHidden; name: string;
  public canceled: boolean;
  public districtsinfo: Object[];
  public form1: FormGroup;
  public total; totali: number = 0;
  public ROLE_SIS; ROLE_IT; ROLE_OA; ROLE_GMA; ROLE_ODMA; ROLE_ORMA; ROLE_GDD: string;

  public nameValueControl = new FormControl();
  public versionValueControl = new FormControl();
  public formCtrlSub: Subscription;

  public pageSize: number;
  public page: number;
  // MatPaginator Output
  public pageEvent: PageEvent;
  public displayedColumns: string[] = ['fullName','last_backup_received','last_backup_idart','last_sync',,'ironkeys','updated','actions'];
  @ViewChild(MatSort) sort: MatSort;
  

  constructor(
    public datepipe: DatePipe,
    public evaluationsService: EvaluationsService,
    public districtsService: DistrictsService,
    public sendsService: SendsService,
    public resourcesService: ResourcesService,
    public receivesService: ReceivesService,
    public translate: TranslateService,
    public syncsService: SyncsService,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
    this.form1 = formBuilder.group({
      canceled: []
    });

    this.districtsService.invokeEvent.subscribe(value => {
      if (value === 'someVal') {
        this.deleteDistrict();
      }
    });

  }

  ngOnInit() {
    
    this.isHidden = "";
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');
    this.total = 0;
    this.page=0;
    this.pageSize=10;

    if(window.sessionStorage.getItem('district-canceled')){
      this.canceled = true;
    }else{
      this.canceled = false;
    }

    if(window.sessionStorage.getItem('district-name')){
      this.name = window.sessionStorage.getItem('district-name');
    }else{
      this.name = "";
    }

    this.formCtrlSub = this.nameValueControl.valueChanges
      .debounceTime(600)
      .subscribe(newValue => {
        this.name = this.nameValueControl.value;
        this.search();
      });
  }

  getPage(event) {
    this.isHidden = "";
    
    if(event!=null){
      if(event.pageIndex||event.pageSize){
      this.page=event.pageIndex;
      this.pageSize=event.pageSize;
      }
    }

    this.districtsService.findDistricts(this.page+1, this.pageSize, this.name.split(" ").join("SPACE"), this.canceled, "createdBy.phoneNumber,updatedBy.phoneNumber,province,districtId,fullName,uid,dateCreated,dateUpdated,createdBy.personName,updatedBy.personName,ironkeys.serial,ironkeys.size,ironkeys.status,ironkeys.uid")
      .subscribe(data => {
        this.totali = data.totalElements;
        this.alldistricts = data.content;
       
      },
        error => {
          this.isHidden = "hide";
          this.total = 0;
          this.districts = [];
          this.districts1 = [];
        },
        () => {
          this.resourcesService.findDistrictsInfo()
            .subscribe(data => {
              this.districtsinfo = data
            },
              error => { },
              () => {

                var districtsInfo = alasql("SELECT [0] AS districtId,[1] AS send_uid_rec,[3] AS last_backup_received,[4] AS send_uid_res,[6] AS last_backup_restored,[7] AS sync_uid,[9] AS server,[10] AS start_time,[11] AS end_time,[12] AS server_report,[13] AS send_uid_idart,[15] AS last_backup_idart   FROM ?", [this.districtsinfo]);
                this.districts1 = alasql("SELECT * FROM ?alldistricts LEFT JOIN ?districtsInfo USING districtId ", [this.alldistricts, districtsInfo]);
                this.districts = new MatTableDataSource(this.districts1);
                this.districts.sort = this.sort;
                this.isHidden = "hide";
                this.total = this.totali;
              });
        }
      );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

  search() {
    var userValue = this.form1.value;
    if (this.name) {
      window.sessionStorage.setItem('district-name',this.name);
    }
    else {
      this.name = "";
      window.sessionStorage.removeItem('district-name');
    }
    if (userValue.canceled) {
      this.canceled = userValue.canceled;
      window.sessionStorage.setItem('district-canceled','true');
    } else {
      this.canceled = false;
      window.sessionStorage.removeItem('district-canceled');
    }
    this.page=0;
    this.getPage(null);

  }

  setDistrict(uid) {
    this.district = this.districts1.find(item => item.uid == uid);
    this.openDialog3();
  }

  setDistrictDelete(uid) {
    this.district = this.districts1.find(item => item.uid == uid);
    this.openDialog4();
    
  }


  public deleteDistrict(): void {
    if(this.district.uid){
    this.isHidden = "";
    this.districtsService.deleteDistrict(this.district.uid)
      .subscribe(data => {
        if (data.text() == "Success") {
          this.isHidden = "";
          this.search();
          this.openSnackBar("Distrito: "+this.district.fullName+", excluido com sucesso!", "OK");
         } else {
          this.isHidden = "hide";
           this.openSnackBar("Não é possivel excluir o Distrito!", "OK");
        }
      },
        error => {
        }
      );}
  }

  setSend(uuid) {
    this.isHidden = "";
    this.sendsService.findOneSendByUuid(uuid, "observation,transporter.canceledReason,transporter.phoneNumber,transporter.name,transporter.role,district.fullName,received,dateUpdated,dateCreated,createdBy.personName,createdBy.phoneNumber,updatedBy.phoneNumber,updatedBy.personName,uid,backupDate,updateFinished,validationFinished,syncFinished,crossDhis2Finished,crossIdartFinished,uid,ikReceived,dateIkReceived,idartBackup,idartBackupDate")
      .subscribe(data => {
        this.send = data;
      }, error => {
      }, () => {
        if (this.send.received == true) {
          this.receivesService.findOneReceiveBySendUuid(uuid, "createdBy.uid,createdBy.userId,createdBy.phoneNumber,send.sendId,transporter.transporterId,transporter.uid,transporter.name,transporter.phoneNumber,receiveId,receiveDate,ikReturned,dateIkReturned,dateCreated,dateUpdated,createdBy.personName,uid,dateRestored,canceledReason,restoredBy.personName,ikReturnedBy.personName,restored")
            .subscribe(data => {
              this.receive = data;
              if (this.receive != null) {
                this.send.receivername = this.receive.createdBy.personName;
                this.send.receivernumber = this.receive.createdBy.phoneNumber;
                this.send.receivedate = this.receive.receiveDate;
                this.send.restored = this.receive.restored;
                if (this.receive.restoredBy != null) {
                  this.send.restorername = this.receive.restoredBy.personName;
                }
                this.send.date_restored = this.receive.dateRestored;
                this.send.sis_observation = this.receive.observation;
                this.send.ik_returned = this.receive.ikReturned;
                if (this.send.ik_returned) {
                  this.send.ik_returneddate = this.receive.dateIkReturned;
                  this.send.ik_returnedto = this.receive.transporter.name+" ("+this.receive.transporter.phoneNumber+")";
                }
              }
            }, error => {
            },
              () => {
                this.isHidden = "hide";
                this.openDialog();
              });
        } else {
          this.isHidden = "hide";
          //this.openDialog();
        }
      });
  }

  setSync(uid) {
    this.isHidden = "";
    this.syncsService.findOneSyncByUuid(uid,"createdBy.phoneNumber,updatedBy.phoneNumber,observation,syncId,startTime,startItemsToSend,startItemsToReceive,endTime,endItemsToSend,endItemsToReceive,observationHis,dateCreated,dateUpdated,syncError,createdBy.personName,updatedBy.personName,uid,serverFault,laptopFault,powerCut,canceled,district.name,server.name,server.type,syncErrorResolved,serverFaultResolved,laptopFaultResolved,powerCutResolved")
      .subscribe(
        sync => {
          this.sync = sync;
        }, error => { }, () => { this.isHidden = "hide";this.openDialog2(); });
  }


  printList() {
    this.isHidden = "";
   

    this.districtsService.findDistricts("", "", this.name, this.canceled, "districtId,fullName,ironkeys.serial,ironkeys.size,ironkeys.status")
      .subscribe(data => {
        this.districtsreport = data.content;
      },
        error => {
          this.isHidden = "hide";
          this.districtsreport = [];
        },
        () => {
          this.resourcesService.findDistrictsInfo()
            .subscribe(data => {
              this.districtsinfo = data
            },
              error => { },
              () => {

                var districtsInfo = alasql("SELECT [0] AS districtId,[1] AS send_uid_rec,IFNULL([3],'') AS last_backup_received,[4] AS send_uid_res,IFNULL([6],'') AS last_backup_restored,[7] AS sync_uid,[9] AS server,[10] AS start_time,[11] AS end_time,IFNULL([12],'') AS server_report,IFNULL([15],'') AS last_backup_idart   FROM ?", [this.districtsinfo]);
                this.districtsreport = alasql("SELECT * FROM ?districtsreport LEFT JOIN ?districtsInfo USING districtId ", [this.districtsreport, districtsInfo]);

                this.isHidden = "hide";
                this.total = this.totali;
                var user = JSON.parse(window.sessionStorage.getItem('user'));
                var doc = new jsPDF('landscape');
                var totalPagesExp = "{total_pages_count_string}";
                var columns = [
                  { title: "Distrito/ US", dataKey: "fullName" },
                  { title: "Último Backup\nOpenMRS", dataKey: "last_backup_received" },
                  { title: "Último backup\niDART", dataKey: "last_backup_idart" },
                  { title: "Última\nSincronização", dataKey: "server_report" },
                  { title: "Ironkey(s)", dataKey: "ironkeys" }
                ];
                var listSize = this.districtsreport.length;
                var datenow = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
                // HEADER
                doc.setFontSize(18);
                doc.text('Lista de Distritos', 14, 22);
                doc.setFontSize(14);
                doc.text(listSize + ' distritos/us encontrados.', 14, 45);
                doc.setFontSize(11);
                doc.setTextColor(100);
                var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
                var text = doc.splitTextToSize('Distritos/US representam locais apoiados por FGH onde existe uma Base de Dados OpenMRS.', pageWidth - 25, {});
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
                doc.autoTable(columns, this.districtsreport, {
                  startY: 50,
                  styles: { overflow: 'linebreak' },
                  bodyStyles: { valign: 'top' },
                  theme: 'grid',
                  headerStyles: { fillColor: [41, 128, 185], lineWidth: 0 },
                  addPageContent: pageContent,
                  columnStyles: {
                    ironkeys: { columnWidth: 100}
                     },
                  createdCell: function (cell, data) {
                    if (data.column.dataKey === 'ironkeys') {
                      if (cell.raw == null) {
                        cell.text = "";
                      } else {
                        if (cell.raw.length < 2) {
                          for (let i of cell.raw) {
                            cell.text = i.size + " GB - " + i.serial + " - " + i.status;
                          }
                        } else {
                          var n=1;
                          for (let i of cell.raw) {
                            if (n==1){
                            cell.text = i.size + " GB - " + i.serial + " - " + i.status;
                            n=n+1;}
                            else{
                            cell.text = cell.text+"\n"+ i.size + " GB - " + i.serial + " - " + i.status;
                            }
                          }
                          
                        }
                      } }
                  }
                });
                doc.setFontSize(11);
                doc.setTextColor(100);
                doc.text('Lista impressa em: ' + datenow + ', por: ' + user.person.othersNames + ' ' + user.person.surname + '.', 14, doc.autoTable.previous.finalY + 10);
                doc.setTextColor(0, 0, 200);
                doc.textWithLink('© Sistema de Controle de Backup', 14, doc.autoTable.previous.finalY + 15, { url: myGlobals.Production_URL });
                if (typeof doc.putTotalPages === 'function') {
                  doc.putTotalPages(totalPagesExp);
                }
                doc.save('SCB_Lista de Distritos_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HH:mm') + '.pdf');
              });

        });
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
    data: this.sync
  });
     
}

openDialog3(): void {
  const dialogRef = this.dialog.open(DialogOverviewExampleDialog3, {
    width: '800px',
    height: '600px',
    data: this.district
  });
     
}


openDialog4(): void {
  const dialogRef = this.dialog.open(DialogOverviewExampleDialog4, {
    width: '800px',
    height: '250px',
    data: this.district
  });
     
}

}

@Component({
  selector: 'districts-info-dialog',
  templateUrl: 'districts-info-dialog.html',
})
export class DialogOverviewExampleDialog3 {

  public displayedColumns: string[] = ['serial','size','state'];

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog3>,
    @Inject(MAT_DIALOG_DATA) public data: District) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'districts-delete-dialog',
  templateUrl: 'districts-delete-dialog.html',
})
export class DialogOverviewExampleDialog4 {

  
  constructor(
    public districtsService: DistrictsService,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog4>,
    @Inject(MAT_DIALOG_DATA) public data: District) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDeleteClick(): void {
    this.districtsService.callMethodOfSecondComponent();
    this.dialogRef.close();
  }

}


@Component({
  selector: 'districts-backup-dialog',
  templateUrl: 'districts-backup-dialog.html',
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
  selector: 'districts-sync-dialog',
  templateUrl: 'districts-sync-dialog.html',
})
export class DialogOverviewExampleDialog2 {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog2>,
    @Inject(MAT_DIALOG_DATA) public data: Sync) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  getSyncTimeline(start, end) {
    var time;
    if (start && end) {
      let timeStart = new Date(start);
      let timeEnd = new Date(end);
      time = ("0" + timeStart.getDate()).slice(-2) + "/" + ("0" + (timeStart.getMonth() + 1)).slice(-2) + "/" + timeStart.getFullYear() + " " + ("0" + timeStart.getHours()).slice(-2) + ":" + ("0" + timeStart.getMinutes()).slice(-2) + "-" + ("0" + timeEnd.getHours()).slice(-2) + ":" + ("0" + timeEnd.getMinutes()).slice(-2);
    }
    else {
      let timeStart = new Date(start);
      time = ("0" + timeStart.getDate()).slice(-2) + "/" + ("0" + (timeStart.getMonth() + 1)).slice(-2) + "/" + timeStart.getFullYear() + " " + ("0" + timeStart.getHours()).slice(-2) + ":" + ("0" + timeStart.getMinutes()).slice(-2);
    }
    return time;
  }

  getSyncStatus(start, end) {
    if (start && end) {
      return "complete";
    }
    else {
      return "progress"
    }
  }

  getSyncExpires(start) {
    var date =new Date();
    date.setDate(date.getDate()+1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    var date2 =new Date();
    date2.setDate(date2.getDate());
    date2.setHours(0);
    date2.setMinutes(0);
    date2.setSeconds(0);
    if (new Date(start)>date2&&new Date(start)<date) {
      return false;
    }
    else {
      return true;
    }
  }

  getSyncDuration(start, end) {
    var time;
    if (start && end) {
      let timeStart = new Date(start);
      let timeEnd = new Date(end);
      var duration = timeEnd.getTime() - timeStart.getTime();
      let hours: any = Math.floor(duration / (1000 * 60 * 60) % 60);
      let minutes: any = Math.floor(duration / (1000 * 60) % 60);
      let seconds: any = Math.floor(duration / 1000 % 60);
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      return hours + 'h ' + minutes +'min';
    }

    else {
      time = "-";
    }
    return time;
  }


}