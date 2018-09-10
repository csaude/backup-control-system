/**
 * Copyright (C) 2014-2018, Friends in Global Health, LLC
 * All rights reserved.
 */
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SyncsService } from "./shared/syncs.service";
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
  public allservers;allserversfd: Server[] = [];
  public form: FormGroup;
  public districts_filter; servers_filter; date_filter: boolean;

  public disabled1; disabled2: boolean;
  public from; until;district_id;server_id;p;

  public user: Object[] = [];
  public options: Pickadate.DateOptions = {
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyymmdd',
    onClose: () => this.search()
  };
  public total; totali; number = 0;


  constructor(public datepipe: DatePipe, public syncsService: SyncsService,
    public translate: TranslateService, public districtsService: DistrictsService, formBuilder: FormBuilder, public serversService: ServersService) {
    this.form = formBuilder.group({
      district: [],
      server: [],
      start_from: [],
      start_until: []
    });
  }
  ngOnInit() {
    this.total = 0;
    this.isHidden = "";
    this.server_id = "";
    this.from="";
    this.until="";
    this.district_id="";
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

      var districts;
      if (!this.ROLE_SIS && user.districts.find(item => item.parentdistrict != null)) {
        districts = user.districts.filter(item => item.parentdistrict == null);
      }
      else if (!this.ROLE_SIS && user.districts.find(item => item.parentdistrict == null)) {
        districts = user.districts;
      }
      this.alldistricts = districts

    } else {

      this.districtsService.getDistrictsPaginated(1, 100000, "", false)
        .subscribe(data => {
          var filteredd = data.content.filter(item => item.parentdistrict == null);
          this.alldistricts = filteredd;
        });

    }

    this.disabled1 = true;
        this.serversService.getServersPaginated(1, 10000000, "", "", false, "")
          .subscribe(data => {
            this.allservers = data.content;
            this.allserversfd=data.content;
            this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,servers->name ASC", [this.allservers]);

          }, error => { }, () => { this.disabled1 = false; });

    this.getPage(1);

  }

  getPage(page: number) {
    this.isHidden = "";
    this.syncsService.getSyncs(page, 10, this.district_id, this.server_id, this.from, this.until)
      .subscribe(data => {
        this.total = data.totalElements;
        this.p = page;
        this.syncs = data.content;
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
    this.sync = this.syncs.find(item => item.uuid == uuid);
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


  search() {

    var userValue = this.form.value;
    

    if (userValue.district == "all" || userValue.district == null) {
      this.district_id = "";
      this.disabled1 = true;
        this.serversService.getServersPaginated(1, 10000000, "", "", false, "")
          .subscribe(data => {
            this.allservers = data.content;
            this.allserversfd=data.content;
            this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,servers->name ASC", [this.allservers]);

          }, error => { }, () => { this.disabled1 = false; });
    } else {
      this.district_id = userValue.district;
      this.disabled1 = true;
      this.serversService.getServersPaginated(1, 10000000, this.district_id, "", false, "")
        .subscribe(data => {
          this.allservers = data.content;
          this.allserversfd=data.content;
          this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,servers->name ASC", [this.allservers]);

        }, error => { }, () => { this.disabled1 = false; });
    }

    if (userValue.server == "all" || userValue.server == null) {
      this.disabled2=false;
      this.server_id = "";
    } else {
      this.server_id = userValue.server;
      this.disabled2=true;
    }

    if ((userValue.start_from != "" && userValue.start_from != null) && (userValue.start_until != "" && userValue.start_until != null)) {
      if (userValue.start_from < userValue.start_until) {
        this.from = userValue.start_from;
        this.until = userValue.start_until
      }else{
        this.from = "";
        this.until = "";
      }
    }else{
      this.from = "";
      this.until = "";
    }

    this.getPage(1);

  }


  printList() {
    this.isHidden = "";
    var total;

          this.syncsService.getSyncs(1, 1000000, this.district_id, this.server_id, this.from, this.until)
            .subscribe(data => {
              this.syncsreport = data.content;
              this.syncsreport = alasql("SELECT * FROM ?syncsreport ORDER BY server->districtname ASC,start_time DESC ", [this.syncsreport]);
              total = data.totalElements;
              
              for (let s of this.allserversfd) {
                if (!this.syncsreport.find(item => item.serverreport == s.name + "\n" + s.districtname)) {
                  let sync = new Sync();
                  sync.serverreport = s.name + "\n" + s.districtname;
                  sync.observations = "Não registou sincronização neste periodo.";
                  this.syncsreport.push(sync);
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
                  { title: "Duração", dataKey: "duration" },
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
                doc.text('Lista de Sincronizações efectuadas', 14, 22);
                doc.setFontSize(14);
                doc.text(listSize + ' sincronizações, efectuadas de ' + this.from + ' até ' + this.until + '.', 14, 45);
                doc.setFontSize(11);
                doc.setTextColor(100);
                var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
                var text = doc.splitTextToSize('Sincronizações que ocorreram num determinado periodo.', pageWidth - 25, {});
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
                    serverreport: { columnWidth: 45, fontSize: 10 },
                    synctime: { columnWidth: 28, fontSize: 10 },
                    duration: { columnWidth: 26, fontSize: 10 },
                    startitems: { columnWidth: 33, fontSize: 10 },
                    enditems: { columnWidth: 33, fontSize: 10 },
                    syncerror: { columnWidth: 24, fontSize: 7 },
                    syncer: { columnWidth: 28, fontSize: 10 },
                    observations: { columnWidth: 55, fontSize: 10 }

                  },
                  theme: 'grid',
                  headerStyles: { fillColor: [41, 128, 185], lineWidth: 0 },
                  addPageContent: pageContent
                });
                doc.setFontSize(11);
                doc.setTextColor(100);
                doc.text('Lista impressa em: ' + datenow + ', por: ' + user.person.others_names + ' ' + user.person.surname + '.', 14, doc.autoTable.previous.finalY + 10);
                doc.setTextColor(0, 0, 200);
                doc.textWithLink('Sistema de Controle de Backup', 14, doc.autoTable.previous.finalY + 15, { url: myGlobals.Production_URL });

                if (typeof doc.putTotalPages === 'function') {
                  doc.putTotalPages(totalPagesExp);
                }
                doc.save('SCB_Sincronizações efectuadas_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm') + '.pdf');

              }
            );

  }

}
