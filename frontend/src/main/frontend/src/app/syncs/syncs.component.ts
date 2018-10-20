/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SyncsService } from "./shared/syncs.service";
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Sync } from "./shared/sync";
declare var jsPDF: any; // Important
import { DatePipe } from '@angular/common';
import { DistrictsService } from '../districts/shared/districts.service';
import { District } from '../districts/shared/district';
import { ServersService } from '../servers/shared/servers.service';
import { Server } from '../servers/shared/server';
import { TranslateService } from 'ng2-translate';
import * as alasql from 'alasql';
import * as myGlobals from '../../globals';

@Component({
  selector: 'app-syncs',
  templateUrl: './syncs.component.html',
  styleUrls: ['./syncs.component.css']
})

/** 
* @author Damasceno Lopes
*/
export class SyncsComponent implements OnInit {
  public syncs; syncsreport: Sync[] = [];
  public sync_id: number;
  public sync: Sync = new Sync();
  public isHidden; isHidden2m: string;
  public allsyncs: Sync[] = [];
  public allsyncs2: Sync[] = [];

  public ROLE_SIS: string;
  public ROLE_IT: string;
  public ROLE_ODMA: string;
  public ROLE_GDD: string;
  public ROLE_ORMA: string;
  public ROLE_OA: string;
  public ROLE_GMA: string;

  public alldistricts: District[] = [];
  public allservers; allserversfd: Server[] = [];
  public form: FormGroup;
  public districts_filter; servers_filter; date_filter: boolean;

  public disabled1; disabled2: boolean;
  public from; until; district_id; server_id; p;

  public user: Object[] = [];
  public nIntervId;

  public pageSize: number;

  public options: Pickadate.DateOptions = {
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyymmdd',
    today: 'Hoje',
    close: 'Fechar',
    clear:'Limpar',
    onClose: () => this.search()
  };
  public total; totali; number = 0;

  public next; previous: number = 0;
  public first; last; range: string;

  constructor(
    public datepipe: DatePipe,
    public syncsService: SyncsService,
    public translate: TranslateService,
    public districtsService: DistrictsService,
    public formBuilder: FormBuilder,
    public serversService: ServersService,
    public router: Router) {
    this.form = formBuilder.group({
      district: [],
      server: [],
      start_from: [],
      start_until: []
    });
  }
  ngOnInit() {
    this.total = 0;
    this.pageSize = 15;
    this.isHidden = "";
    this.server_id = "";
    this.from = "";
    this.until = "";
    this.district_id = "";
    this.districts_filter = false;
    this.servers_filter = false;
    var user = JSON.parse(window.sessionStorage.getItem('user'));
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');

    if (this.ROLE_GDD || this.ROLE_ODMA || this.ROLE_ORMA) {

      this.alldistricts = user.districts.filter(item => item.parentDistrictId == null);
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

    } else {

      this.districtsService.findDistricts("", "", "", "", "fullName,districtId,parent.name")
        .subscribe(data => {
          var filteredd = data.content.filter(item => item.parent == null);
          this.alldistricts = filteredd;
        });

    }

    this.disabled1 = true;
    this.serversService.findServers("", "", "", "", "", "", "name,serverId,district.name")
      .subscribe(data => {
        this.allservers = data.content;
        this.allserversfd = data;
        this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,name ASC", [this.allservers]);

      }, error => { }, () => { this.disabled1 = false; });

    this.getPage(1);
    clearInterval(this.nIntervId);

    this.nIntervId = setInterval(() => {

      if (this.router.url == "/syncs") {
        this.getPage(this.p);
      }

    }, 180000);
  }

  ngOnDestroy() {
    clearInterval(this.nIntervId);
  }

  getPage(page: number) {
    this.first = "";
    this.last = "";
    this.isHidden = "";
    this.syncsService.findSyncs(page, this.pageSize, this.district_id, this.server_id, this.from, this.until, "observation,syncId,startTime,startItemsToSend,startItemsToReceive,endTime,endItemsToSend,endItemsToReceive,observationHis,dateCreated,dateUpdated,syncError,createdBy.personName,updatedBy.personName,uid,serverFault,laptopFault,powerCut,canceled,district.name,server.name,server.type")
      .subscribe(data => {
        this.total = data.totalElements;
        this.p = page;
        this.syncs = data.content;
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
          this.syncs = [];
        },
        () => {
          this.isHidden = "hide";
        }
      );
  }

  setSync(uuid) {
    this.sync = this.syncs.find(item => item.uid == uuid);
  }


  deleteSync(sync) {
    if (confirm("Deseja realmente excluir " + sync.name + "?")) {
      var index = this.syncs.indexOf(sync);
      this.syncs.splice(index, 1);
      this.syncsService.deleteSync(sync.sync_id)
        .subscribe(null,
          err => {
            alert("Could not delete sync.");
            // Revert the view back to its original state
            this.syncs.splice(index, 0, sync);
          }
        );
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

  search() {

    var userValue = this.form.value;
    if (userValue.district == "all" || userValue.district == null) {
      this.district_id = "";
    } else {
      this.district_id = userValue.district;
    }

    if (userValue.server == "all" || userValue.server == null) {
      this.server_id = "";
    } else {
      this.server_id = userValue.server;
    }

    if ((userValue.start_from != "" && userValue.start_from != null) && (userValue.start_until != "" && userValue.start_until != null)) {
      if (userValue.start_from <= userValue.start_until) {
        this.from = userValue.start_from;
        this.until = userValue.start_until
      } else {
        this.from = "";
        this.until = "";
      }
    } else {
      this.from = "";
      this.until = "";
    }

    this.getPage(1);

  }

  searchSize() {
    this.getPage(1);
  }


  printList() {
    this.isHidden = "";
    var total;

    alasql.fn.datetime = function (dateStr) {
      var date = new Date(dateStr);
      return ("0" + date.getDate()).slice(-2)+"/"+("0" + (date.getMonth()+1)).slice(-2)+"/"+date.getFullYear();
      ;
    };

    alasql.fn.time = function (dateStr) {
      if(dateStr){
      var date = new Date(dateStr);
      return ("0" + date.getHours()).slice(-2)+":"+("0" + date.getMinutes()).slice(-2)
      ;
      }else{
        return "";
      }
    };
    

    this.syncsService.findSyncs(1, 1000, this.district_id, this.server_id, this.from, this.until, "observation,syncId,startTime,startItemsToSend,startItemsToReceive,endTime,endItemsToSend,endItemsToReceive,observationHis,dateCreated,dateUpdated,syncError,createdBy.personName,updatedBy.personName,uid,serverFault,laptopFault,powerCut,canceled,district.name,server.name,server.type")
      .subscribe(data => {
        this.syncsreport = data.content;
        this.syncsreport = alasql("SELECT CONCAT(server->name,'\n',district->name) AS serverreport,CONCAT(datetime(startTime),'\n',time(startTime),'-',time(endTime)) AS synctime, CONCAT(startItemsToSend,' por enviar\n',startItemsToReceive,' por receber') startitems,CASE WHEN endTime IS NOT NULL THEN CONCAT(endItemsToSend,' por enviar\n',endItemsToReceive,' por receber') ELSE '' END AS enditems, CONCAT(CASE WHEN syncError=true THEN 'Erro de Sync\n' ELSE '' END, CASE WHEN serverFault=true THEN 'Servidor avariou\n' ELSE '' END, CASE WHEN laptopFault=true THEN 'Laptop avariou\n' ELSE '' END, CASE WHEN powerCut=true THEN 'Corte de energia' ELSE '' END) AS syncerror ,createdBy->personName AS syncer,CONCAT('M&A: ',observation,'\nSIS: ',observationHis) AS observations FROM ?syncsreport ORDER BY district->name ASC,startTime DESC ", [this.syncsreport]);
        total = data.content.length;

        if (this.district_id == '' && this.server_id == '') {
          for (let s of this.allserversfd) {
            if (!this.syncsreport.find(item => item.serverreport == s.name + "\n" + s.districtName)) {
              let sync = new Sync();
              sync.serverreport = s.name + "\n" + s.districtName;
              sync.observations = "Não registou sincronização neste periodo.";
              this.syncsreport.push(sync);
            }
          }
        }


      },
        error => {
          this.isHidden = "hide";

        },
        () => {
          this.isHidden = "hide";

          var user = JSON.parse(window.sessionStorage.getItem('user'));
          var doc = new jsPDF('landscape');
          var totalPagesExp = "{total_pages_count_string}";
          var columns = [
            { title: "Servidor", dataKey: "serverreport" },
            { title: "Horário de\nSincronização", dataKey: "synctime" },
            { title: "Nº itens na\nHora inicial", dataKey: "startitems" },
            { title: "Nº itens na\nHora final", dataKey: "enditems" },
            { title: "Ocorrências", dataKey: "syncerror" },
            { title: "Sincronização\niniciada por", dataKey: "syncer" },
            { title: "Observação", dataKey: "observations" }

          ];
          var listSize = total;
          var datenow = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');

          // HEADER
          doc.setFontSize(18);
          doc.text('Lista de Sincronizações Registadas', 14, 22);
          doc.setFontSize(14);
          doc.text(listSize + ' sincronizações, registadas de ' + this.from + ' até ' + this.until + '.', 14, 45);
          doc.setFontSize(11);
          doc.setTextColor(100);
          var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
          var text = doc.splitTextToSize('Sincronizações regustadas num determinado periodo.', pageWidth - 25, {});
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
          doc.autoTable(columns, this.syncsreport, {
            startY: 50,
            styles: { overflow: 'linebreak' },
            bodyStyles: { valign: 'top' },
            columnStyles: {
              serverreport: { columnWidth: 35, fontSize: 10 },
              synctime: { columnWidth: 28, fontSize: 10 },
              startitems: { columnWidth: 33, fontSize: 10 },
              enditems: { columnWidth: 33, fontSize: 10 },
              syncerror: { columnWidth: 29, fontSize: 8 },
              syncer: { columnWidth: 28, fontSize: 10 },
              observations: { columnWidth: 50, fontSize: 10 }

            },
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
          doc.save('SCB_Sincronizações efectuadas_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm') + '.pdf');

        }
      );

  }

}
