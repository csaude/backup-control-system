/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DistrictsService } from "./shared/districts.service";
import { ResourcesService } from "./../resources/shared/resources.service";
import { District } from "./shared/district";
import { SendsService } from "./../sends/shared/sends.service";
import { Send } from "./../sends/shared/send";
import { SyncsService } from "./../syncs/shared/syncs.service";
import { Sync } from "./../syncs/shared/sync";
import { Receive } from '../receives/shared/receive';
import { ReceivesService } from '../receives/shared/receives.service';
import { Evaluation } from '../evaluations/shared/evaluation';
import { EvaluationsService } from '../evaluations/shared/evaluations.service';
import { MzToastService } from 'ngx-materialize';
import { DatePipe } from '@angular/common';
import { TranslateService } from 'ng2-translate';
declare var jsPDF: any;
import * as alasql from 'alasql';
import * as myGlobals from '../../globals';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-districts',
  templateUrl: './districts.component.html',
  styleUrls: ['./districts.component.css']
})

/** 
* @author Damasceno Lopes
*/
export class DistrictsComponent implements OnInit {

  public districts; districtsreport; alldistricts; userDistricts: District[] = [];
  public district: District = new District();
  public send: Send = new Send();
  public sends: Send[] = [];
  public receive: Receive = new Receive();
  public evaluations: Evaluation[] = [];
  public evaluation: Evaluation = new Evaluation();
  public syncs: Sync[] = [];
  public sync: Sync = new Sync();
  public p: number;
  public isHidden; isHidden2m; isDisabledt; isDisabledt2; isHidden2; name; isHiddenConnection: string;
  public isDisabled; showResult; disabled1; canceled: boolean;
  public resultEvaluation; districtsinfo: Object[];
  public keys: string[] = [];
  public form; form1: FormGroup;
  public total; totali: number = 0;
  public ROLE_SIS; ROLE_IT; ROLE_OA; ROLE_GMA; ROLE_ODMA; ROLE_ORMA; ROLE_GDD: string;

  public next; previous: number = 0;
  public first; last; range: string;

  public next1; previous1: number = 0;
  public first1; last1; range1; counter: string;

  public nameValueControl = new FormControl();
  public versionValueControl = new FormControl();
  public formCtrlSub: Subscription;

  public pageSize: number;

  constructor(
    public datepipe: DatePipe,
    public evaluationsService: EvaluationsService,
    public districtsService: DistrictsService,
    public toastService: MzToastService,
    public sendsService: SendsService,
    public resourcesService: ResourcesService,
    public receivesService: ReceivesService,
    public translate: TranslateService,
    public syncsService: SyncsService,
    public formBuilder: FormBuilder) {
    this.form1 = formBuilder.group({
      canceled: []
    });
  }

  ngOnInit() {
    this.name = "";
    this.canceled = false;
    this.isHidden = "";
    this.isHiddenConnection = "hide";
    this.isDisabledt = "disabled";
    this.isDisabledt2 = "disabled";
    this.isHidden2 = "hide";
    this.isDisabled = false;
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');
    this.total = 0;
    this.pageSize = 15;
    this.getPage(1);

    this.formCtrlSub = this.nameValueControl.valueChanges
      .debounceTime(600)
      .subscribe(newValue => {
        this.name = this.nameValueControl.value;
        this.search();
      });

  }

  getPage(page: number) {
    this.first = "";
    this.last = "";
    this.isHidden = "";

    this.districtsService.findDistricts(page, this.pageSize, this.name, this.canceled, "province,districtId,fullName,uid,dateCreated,dateUpdated,createdBy.personName,updatedBy.personName,ironkeys.serial,ironkeys.size,ironkeys.status,ironkeys.uid")
      .subscribe(data => {
        this.totali = data.totalElements;
        this.p = page;
        this.alldistricts = data.content;
        this.next = page + 1;
        this.previous = page - 1;
        if (data.first == true && data.last == true) {
          this.first = "disabled";
          this.last = "disabled";
          this.range = ((page * this.pageSize) - (this.pageSize - 1)) + " - " + data.totalElements;
        }
        else if (data.first == true && data.last == false) {
          this.first = "disabled";
          this.range = ((page * this.pageSize) - (this.pageSize - 1)) + " - " + (page * this.pageSize);
        }
        else if (data.first == false && data.last == true) {
          this.last = "disabled";
          this.range = ((page * this.pageSize) - (this.pageSize - 1)) + " - " + data.totalElements;
        }
        else if (data.first == false && data.last == false) {
          this.range = ((page * this.pageSize) - (this.pageSize - 1)) + " - " + + (page * this.pageSize);
        }
      },
        error => {
          this.isHidden = "hide";
          this.total = 0;
          this.p = 1;
          this.districts = [];
        },
        () => {
          this.resourcesService.findDistrictsInfo()
            .subscribe(data => {
              this.districtsinfo = data
            },
              error => { },
              () => {

                var districtsInfo = alasql("SELECT [0] AS districtId,[1] AS send_uid_rec,[3] AS last_backup_received,[4] AS send_uid_res,[6] AS last_backup_restored,[7] AS sync_uid,[9] AS server,[10] AS start_time,[11] AS end_time,[12] AS server_report   FROM ?", [this.districtsinfo]);
                this.districts = alasql("SELECT * FROM ?alldistricts LEFT JOIN ?districtsInfo USING districtId ", [this.alldistricts, districtsInfo]);
                this.isHidden = "hide";
                this.isDisabledt = "";
                this.total = this.totali;
              });
        }
      );
  }

  search() {
    var userValue = this.form1.value;
    if (this.name) {
      this.name = this.name.split(" ").join("SPACE");
    }
    else {
      this.name = "";
    }
    if (userValue.canceled) {
      this.canceled = userValue.canceled;
    } else {
      this.canceled = false;
    }

    this.getPage(1);

  }

  searchSize() {
    this.getPage(1);
  }


  setDistrict(uid) {
    this.district = this.districts.find(item => item.uid == uid);
  }


  deleteDistrict() {
    this.isDisabledt = "disabled";
    this.isHidden = "";
    this.districtsService.deleteDistrict(this.district.uid)
      .subscribe(data => {
        if (data.text() == "Success") {
          this.isHidden = "";
          this.search()
          this.showMsg(this.district.fullName);
          this.isDisabledt = "disabled";
        } else {
          this.isHidden = "hide";
          this.isDisabledt = "";
          this.showMsgErr(this.district.fullName);
        }
      },
        error => {
        }
      );
  }

  setSend(uuid) {
    this.isHidden2m = "";
    this.sendsService.findOneSendByUuid(uuid, "observation,transporter.phoneNumber,transporter.name,district.fullName,received,dateUpdated,dateCreated,createdBy.personName,updatedBy.personName,uid,backupDate,updateFinished,validationFinished,syncFinished,crossDhis2Finished,crossIdartFinished,uid,ikReceived,dateIkReceived,idartBackup,idartBackupDate")
      .subscribe(data => {
        this.send = data;
      }, error => {
      }, () => {
        if (this.send.received == true) {
          this.receivesService.findOneReceiveBySendUuid(uuid, "createdBy.uid,createdBy.userId,send.sendId,transporter.transporterId,transporter.uid,transporter.name,transporter.phoneNumber,receiveId,receiveDate,ikReturned,dateIkReturned,dateCreated,dateUpdated,createdBy.personName,uid,dateRestored,canceledReason,restoredBy.personName,ikReturnedBy.personName,restored")
            .subscribe(data => {
              this.receive = data;
              if (this.receive != null) {
                this.send.receivername = this.receive.createdBy.personName;
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
                  this.send.ik_returnedto = this.receive.transporter.name;
                }
              }
            }, error => {
            },
              () => {
                this.isHidden2m = "hide";
              });
        } else {
          this.isHidden2m = "hide";
        }
      });
  }

  evaluate() {
    this.isHidden2 = "";
    this.isDisabledt2 = "disabled";
    this.isDisabled = true;
    this.showResult = false;
    this.districtsService.evaluateDistrict(this.district.uid, this.evaluation.openmrsSqlUuid)
      .subscribe(data => {
        this.resultEvaluation = data.rows;
      }, error => {
        this.showMsgErr2();
        this.isHidden2 = "hide";
        this.isDisabledt2 = "disabled";
        this.isDisabled = false;
      },
        () => {
          this.isHidden2 = "hide";
          this.isDisabledt2 = "";
          this.isDisabled = false;
          this.showResult = true;
          this.keys = Object.keys(this.resultEvaluation[0])
        }
      );
  }


  download() {
    //this._csvService.download(this.resultEvaluation, this.district.name + '_' + this.evaluation.name + '_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
  }


  clean() {
    this.resultEvaluation = [];
    this.keys = [];
    this.showResult = false;
  }


  setSync(uid) {
    this.isHidden2m = "";
    this.syncsService.findOneSyncByUuid(uid,"observation,syncId,startTime,startItemsToSend,startItemsToReceive,endTime,endItemsToSend,endItemsToReceive,observationHis,dateCreated,dateUpdated,syncError,createdBy.personName,updatedBy.personName,uid,serverFault,laptopFault,powerCut,canceled,district.name,server.name,server.type")
      .subscribe(
        sync => {
          this.sync = sync;
        }, error => { }, () => { this.isHidden2m = "hide"; });
  }


  printList() {
    this.isHidden = "";
    this.isDisabledt = "disabled";


    this.districtsService.findDistricts("", "", this.name, this.canceled, "districtId,fullName,ironkeys.serial,ironkeys.size,ironkeys.status")
      .subscribe(data => {
        this.districtsreport = data.content;
      },
        error => {
          this.isHidden = "hide";
          this.isDisabledt = "";
          this.districtsreport = [];
        },
        () => {
          this.resourcesService.findDistrictsInfo()
            .subscribe(data => {
              this.districtsinfo = data
            },
              error => { },
              () => {

                var districtsInfo = alasql("SELECT [0] AS districtId,[1] AS send_uid_rec,IFNULL([3],'') AS last_backup_received,[4] AS send_uid_res,IFNULL([6],'') AS last_backup_restored,[7] AS sync_uid,[9] AS server,[10] AS start_time,[11] AS end_time,IFNULL([12],'') AS server_report   FROM ?", [this.districtsinfo]);
                this.districtsreport = alasql("SELECT * FROM ?districtsreport LEFT JOIN ?districtsInfo USING districtId ", [this.districtsreport, districtsInfo]);

                this.isHidden = "hide";
                this.isDisabledt = "";
                this.total = this.totali;
                var user = JSON.parse(window.sessionStorage.getItem('user'));
                var doc = new jsPDF('landscape');
                var totalPagesExp = "{total_pages_count_string}";
                var columns = [
                  { title: "Distrito/ US", dataKey: "fullName" },
                  { title: "Último Backup\nRecebido", dataKey: "last_backup_received" },
                  { title: "Último backup\nRestaurado", dataKey: "last_backup_restored" },
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
                doc.text('Lista impressa em: ' + datenow + ', por: ' + user.person.others_names + ' ' + user.person.surname + '.', 14, doc.autoTable.previous.finalY + 10);
                doc.setTextColor(0, 0, 200);
                doc.textWithLink('© Sistema de Controle de Backup', 14, doc.autoTable.previous.finalY + 15, { url: myGlobals.Production_URL });
                if (typeof doc.putTotalPages === 'function') {
                  doc.putTotalPages(totalPagesExp);
                }
                doc.save('SCB_Distritos_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HH:mm') + '.pdf');
              });

        });
  }


  printList2() {
    this.isHidden = "";
    this.isDisabledt = "disabled";

    this.resultEvaluation = JSON.parse(window.localStorage.getItem('dataCompleteness'));
    window.localStorage.removeItem('dataCompleteness');
    this.isHidden = "hide";
    this.isDisabledt = "";
    this.total = this.totali;
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    var doc = new jsPDF('');
    var totalPagesExp = "{total_pages_count_string}";
    var columns = [
      { title: "Unidade Sanitária", dataKey: "Unidade Sanitária" },
      { title: "Data da última visita", dataKey: "Data da última visita" },
      { title: "Data da última criação", dataKey: "Data da última criação" }
    ];
    var listSize = this.resultEvaluation.length;
    var datenow = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
    // HEADER
    doc.setFontSize(18);
    doc.text('Completude dos Backups das Bases de Dados OpenMRS', 14, 22);
    doc.setFontSize(14);
    doc.text(listSize + ' registos encontrados', 14, 45);
    doc.setFontSize(11);
    doc.setTextColor(100);
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    var text = doc.splitTextToSize('Unidades Sánitárias são locais apoiados por FGH onde existe uma Base de Dados OpenMRS.', pageWidth - 25, {});
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
    doc.autoTable(columns, this.resultEvaluation, {
      startY: 50,
      styles: { overflow: 'linebreak' },
      bodyStyles: { valign: 'top' },
      theme: 'grid',
      headerStyles: { fillColor: [41, 128, 185], lineWidth: 0 },
      addPageContent: pageContent
    });
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text('Lista impressa em: ' + datenow + ', por: ' + user.person.others_names + ' ' + user.person.surname + '.', 14, doc.autoTable.previous.finalY + 10);
    doc.setTextColor(0, 0, 200);
    doc.textWithLink('© Sistema de Controle de Backup', 14, doc.autoTable.previous.finalY + 15, { url: myGlobals.Production_URL });
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
    }
    doc.save('SCB_Completude_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HH:mm') + '.pdf');


  }

  getEvaluations() {
    this.isDisabledt2 = "disabled";
    this.disabled1 = true;
    this.evaluationsService.findEvaluations("", "", "", "", "name,uid,openmrsSqlUuid")
      .subscribe(data => { this.evaluations = data.content; }, error => { this.disabled1 = false; }, () => { this.disabled1 = false; }
      );
  }


  checkConnection() {

    window.localStorage.removeItem("lastCheck");
    window.localStorage.setItem("lastCheck", this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm'));

    this.districtsService.findDistricts("", "", "", false, "uid")
      .subscribe(data => {
        this.userDistricts = data.content;
      }, error => { },
        () => {
          var i = 0;
          for (let district of this.userDistricts) {
            this.isHiddenConnection = "";
            this.districtsService.checkConnection(district.uid).subscribe(
              data => {
              },
              error => {
                window.localStorage.removeItem(district.uid.toString());
                window.localStorage.setItem(district.uid.toString(), 'false');
                i = i + 1;
                if (i == this.userDistricts.length) {
                  this.isHiddenConnection = "hide";
                }
              },
              () => {
                window.localStorage.removeItem(district.uid.toString());
                window.localStorage.setItem(district.uid.toString(), 'true');
                i = i + 1;
                if (i == this.userDistricts.length) {
                  this.isHiddenConnection = "hide";
                }
              }
            );
          }
        }
      );
  }

  dataCompleteness() {

    window.localStorage.removeItem('dataCompleteness');

    this.districtsService.findDistricts("", "", "", false, "uid")
      .subscribe(data => {
        this.userDistricts = data.content;
      }, error => { },
        () => {
          var i = 0;
          var resultList = [];
          for (let district of this.userDistricts) {
            this.counter = "Carregando " + (i + 1) + " de " + (this.userDistricts.length);
            this.isHiddenConnection = "";
            this.districtsService.evaluateDistrict(district.uid, "36840a95-3bef-4378-b9fe-92f882452147")
              .subscribe(data => {
                this.resultEvaluation = data.rows;
              }, error => {
                i = i + 1;
                this.counter = "Carregando " + (i + 1) + " de " + (this.userDistricts.length);
                if (i == this.userDistricts.length) {
                  this.isHiddenConnection = "hide";
                  this.counter = "";
                }

              },
                () => {
                  resultList = resultList.concat(this.resultEvaluation);
                  i = i + 1;
                  this.counter = "Carregando " + (i + 1) + " de " + (this.userDistricts.length);
                  if (i == this.userDistricts.length) {
                    window.localStorage.removeItem('last');
                    window.localStorage.setItem('dataCompleteness', JSON.stringify(resultList));
                    this.isHiddenConnection = "hide";
                    this.counter = "";
                    this.printList2();
                  }

                }
              );

          }
        }
      );
  }

  getOpenMRSConnection(uid) {
    if (window.localStorage.getItem(uid)) {
      return window.localStorage.getItem(uid);
    }
    else {
      return "";
    }
  }

  getLastCheck() {
    if (window.localStorage.getItem("lastCheck")) {
      return window.localStorage.getItem("lastCheck");
    }
    else {
      return "";
    }
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

  showMsg(district) {
    this.toastService.show('Distrito: ' + district + ', excluido com sucesso!', 2000, 'green', null);
  }
  showMsgErr(district) {
    this.toastService.show('Distrito: ' + district + ', não pode ser excluido!', 2000, 'red', null);
  }
  showMsgErr2() {
    this.toastService.show('Erro ao avaliar, tente denovo ou contacte o SIS!', 2000, 'red', null);
  }
  showMsgErr3() {
    this.toastService.show('Data de Backup inicial não pode ser inferior.', 2000, 'red', null);
  }
}