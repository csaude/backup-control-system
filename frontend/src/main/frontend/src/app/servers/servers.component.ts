/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ServersService } from "./shared/servers.service";
import { Server } from "./shared/server";
import { MzToastService } from 'ngx-materialize';
import { TranslateService } from 'ng2-translate';
declare var jsPDF: any; // Important
import { DatePipe } from '@angular/common';
import { District } from './../districts/shared/district';
import { DistrictsService } from './../districts/shared/districts.service';
import { ResourcesService } from "./../resources/shared/resources.service";
import * as myGlobals from '../../globals';
import * as alasql from 'alasql';
import { SyncsService } from "./../syncs/shared/syncs.service";
import { Sync } from "./../syncs/shared/sync";
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})

/** 
* @author Damasceno Lopes
*/
export class ServersComponent implements OnInit {
  public servers; serversreport: Server[] = [];
  public p: number = 1;
  public total: number = 0;
  public form: FormGroup;
  public server: Server = new Server();
  public isHidden; isHidden2m; isDisabledt: string;
  public name; district; type: string;
  public size: string;
  public alldistricts: District[] = [];
  public canceled: boolean;
  public ROLE_SIS: string;
  public ROLE_IT: string;
  public ROLE_OA: string;
  public ROLE_GMA: string;
  public ROLE_ODMA: string;
  public ROLE_ORMA: string;
  public ROLE_GDD: string;
  public serverssyncinfo;
  public syncs: Sync[] = [];
  public sync: Sync = new Sync();

  public pageSize: number;

  public types = [
    { name: 'CHILD' },
    { name: 'PARENT' }
  ]

  public user;
  
  public next;previous: number=0;
  public first; last; range: string;

  public nameValueControl = new FormControl();
  public formCtrlSub: Subscription;
     
  constructor(
    public datepipe: DatePipe,
    public serversService: ServersService,
    public resourcesService: ResourcesService,
    public toastService: MzToastService,
    public translate: TranslateService,
    public formBuilder: FormBuilder,
    public syncsService: SyncsService,
    public districtsService: DistrictsService) {
    this.form = formBuilder.group({
      district: [],
      canceled: [],
      type: []
    });
  }
  ngOnInit() {
    this.name = "";
    this.district = "";
    this.size = "";
    this.type = "";
    this.canceled = false;
    this.pageSize=15;
    this.getPage(1);
    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');
    this.districtsService.findDistricts("","","","","parent.name,name,districtId")
      .subscribe(data => {
        this.alldistricts = data.content.filter(item => item.parent == null);;
      });
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
    this.isDisabledt = "disabled";

    this.resourcesService.findServersInfo()
      .subscribe(data => {
        this.serverssyncinfo = data;
      },
        error => { },
        () => {

          this.serversService.findServers(page, this.pageSize, this.district, this.name, this.canceled, this.type,"canceledBy.personName,canceled,dateCanceled,canceledReason,observation,district.name,name,type,dateCreated,dateUpdated,createdBy.personName,updatedBy.personName,uid,serverId")
            .subscribe(data => {
              this.total = data.totalElements;
              this.p = page;
              var result = data.content;
              var synced = alasql("SELECT [0] AS sync_uuid,[1] AS serverId,[2] AS server_report,[3] AS duration,[4] AS end_items_to_send,[5] AS end_items_to_receive FROM ?", [this.serverssyncinfo]);
              this.servers = alasql("SELECT * FROM ?result LEFT JOIN ?synced USING serverId ", [result, synced]);
              this.next = page + 1;
              this.previous = page - 1;
              if (data.first == true && data.last == true) {
                this.first = "disabled";
                this.last = "disabled";
                this.range = ((page * this.pageSize) - (this.pageSize-1)) + " - " + data.totalElements;
              }
              else if (data.first == true && data.last == false) {
                this.first = "disabled";
                this.range = ((page * this.pageSize) - (this.pageSize-1)) + " - " + (page * this.pageSize);
              }
              else if (data.first == false && data.last == true) {
                this.last = "disabled";
                this.range = ((page * this.pageSize) - (this.pageSize-1)) + " - " + data.totalElements;
              }
              else if (data.first == false && data.last == false) {
                this.range = ((page * this.pageSize) - (this.pageSize-1)) + " - " + + (page * this.pageSize);
              }

            },
              error => {
                this.isHidden = "hide";
                this.isDisabledt = "disabled";
                this.total = 0;
                this.p = 1;
                this.servers = [];
              },
              () => {
                this.isHidden = "hide";
                this.isDisabledt = "";
              }
            );
        });

  }
  search() {
    var userValue = this.form.value;
    if (this.name) {
      this.name = this.name.split(" ").join("SPACE");
    }
    else {
      this.name = "";
    }

    if (userValue.district) {

      if (userValue.district == "all") {
        this.district = "";
      } else {
        this.district = userValue.district;
      }

    }
    else {
      this.district = "";
    }

    if (userValue.canceled) {
      this.canceled = userValue.canceled;
    } else {
      this.canceled = false;
    }

    if (userValue.type) {
      this.type = userValue.type;
      this.type = this.type.split(" ").join("SPACE");
      if (this.type == "all") {
        this.type = "";
      }
    }
    else {
      this.type = "";
    }

    this.getPage(1);
  }

  searchSize(){
    this.getPage(1);
  }

  setServer(uuid) {
    this.server = this.servers.find(item => item.uid == uuid);
  }
  deleteServer() {
    this.isHidden = "";
    this.isDisabledt = "disabled";
    this.serversService.deleteServer(this.server.uid)
      .subscribe(data => {
        if (data.text() == "Success") {
          this.search();
          this.showMsg(this.server.name);
          this.isDisabledt = "";
        } else {
          this.showMsgErr(this.server.name);
          this.isHidden = "hide";
          this.isDisabledt = "";
        }
      }
        ,
        error => {
          alert("Não é possivel excluir o Server!");
          this.isHidden = "hide";
          this.isDisabledt = "";
        },
        () => {
        }
      );
  }



  printList() {
    this.isHidden = "";
    this.isDisabledt = "disabled";


    this.resourcesService.findServersInfo()
      .subscribe(data => {
        this.serverssyncinfo = data;
      },
        error => { },
        () => {

          this.serversService.findServers("", "", this.district, this.name, this.canceled, this.type,"serverId,name,district.name,type")
            .subscribe(data => {
              var result = data.content;
              var synced = alasql("SELECT [0] AS sync_uuid,[1] AS serverId,IFNULL([2],'') AS server_report,[3] AS duration,[4] AS end_items_to_send,[5] AS end_items_to_receive FROM ?", [this.serverssyncinfo]);
              this.serversreport = alasql("SELECT * FROM ?result LEFT JOIN ?synced USING serverId ", [result, synced]);
            },
              error => {
                this.isHidden = "hide";
                this.isDisabledt = "";
                this.serversreport = [];
              },
              () => {
                this.isHidden = "hide";
                this.isDisabledt = "";

                var user = JSON.parse(window.sessionStorage.getItem('user'));
                var doc = new jsPDF('portrait');
                var totalPagesExp = "{total_pages_count_string}";
                var columns = [
                  { title: "Distrito", dataKey: "district" },
                  { title: "Nome do Servidor", dataKey: "name" },
                  { title: "Tipo de Servidor", dataKey: "type" },
                  { title: "Última Sincronização", dataKey: "server_report" }
                ];
                var listSize = this.serversreport.length;
                var datenow = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');

                // HEADER
                doc.setFontSize(18);
                doc.text('Lista de Servidores de Sincronização', 14, 22);
                doc.setFontSize(14);
                doc.text(listSize + ' servidores de sincronização encontrados', 14, 45);
                doc.setFontSize(11);
                doc.setTextColor(100);
                var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
                var text = doc.splitTextToSize('Servidores do tipo CHILD são instâncias do OpenMRS utilizadas para recolher dados nas periferias. O PARENT representa uma instância de Servidor Central.', pageWidth - 25, {});
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
                doc.autoTable(columns, this.serversreport, {
                  startY: 50,
                  styles: { overflow: 'linebreak' },
                  bodyStyles: { valign: 'top' },
                  theme: 'grid',
                  headerStyles: { fillColor: [41, 128, 185], lineWidth: 0 },
                  addPageContent: pageContent,
                  createdCell: function(cell, data) {
                    if (data.column.dataKey === 'district') {
                        cell.text = cell.raw.name;
                    }
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
                doc.save('SCB_Servidores de Sincronização_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm') + '.pdf');


              }
            );




        });


  }

  setSync(uuid) {
    this.isHidden2m = "";
    this.syncsService.findOneSyncByUuid(uuid,"observation,syncId,startTime,startItemsToSend,startItemsToReceive,endTime,endItemsToSend,endItemsToReceive,observationHis,dateCreated,dateUpdated,syncError,createdBy.personName,updatedBy.personName,uid,serverFault,laptopFault,powerCut,canceled,district.name,server.name,server.type")
      .subscribe(
        sync => {
          this.sync = sync;
        }, error => { }, () => { this.isHidden2m = "hide"; });
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

  showMsg(server) {
    this.toastService.show('Servidor de sincronização: ' + server + ', excluido com sucesso!', 2000, 'green', null);
  }
  showMsgErr(server) {
    this.toastService.show('Servidor de sincronização: ' + server + ', não pode ser excluido!', 2000, 'red', null);
  }
}