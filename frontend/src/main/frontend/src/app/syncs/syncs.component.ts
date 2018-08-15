/**
 * @author damasceno.lopes
 * @email damasceno.lopes@fgh.org.mz
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

  public p;
  public alldistricts: District[] = [];
  public allservers: Server[] = [];
  public form: FormGroup;
  public districts_filter; servers_filter; date_filter: boolean;

  public disabled1; disabled2: boolean;
  public from; until;

  public user: Object[] = [];
  public district_id: number;
  public server_id: number;
  public options: Pickadate.DateOptions = {
    format: 'dd/mm/yyyy',
    formatSubmit: 'yyyy-mm-dd',
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
    this.districts_filter = false;
    this.servers_filter = false;
    var user = JSON.parse(window.localStorage.getItem('user'));
    this.ROLE_SIS = window.localStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.localStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.localStorage.getItem('ROLE_IT');
    this.ROLE_ODMA = window.localStorage.getItem('ROLE_ODMA');
    this.ROLE_GDD = window.localStorage.getItem('ROLE_GDD');
    this.ROLE_ORMA = window.localStorage.getItem('ROLE_ORMA');
    this.ROLE_GMA = window.localStorage.getItem('ROLE_GMA');

    if (this.ROLE_GDD || this.ROLE_ODMA || this.ROLE_ORMA) {

      this.alldistricts = user.districts.sort(function (a, b) {
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

      this.serversService.getServersByUser()
        .subscribe(data => {
          this.allservers = data;
          this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,servers->name ASC", [this.allservers]);

        });
      this.date_filter = false;
      this.districts_filter = false;
      this.servers_filter = false;

      this.getPageSync(1);


    } else if (this.ROLE_SIS || this.ROLE_GMA || this.ROLE_OA) {

      this.districtsService.getDistricts()
        .subscribe(data => {
          this.alldistricts = data;
        });

      this.serversService.getServers()
        .subscribe(data => {
          this.allservers = data;
          this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,servers->name ASC", [this.allservers]);

        });
      this.date_filter = false;
      this.districts_filter = false;
      this.servers_filter = false;

      this.getAllPageSync(1);

    }


  }

  getPageSync(page: number) {
    this.isHidden = "";
    this.syncsService.getSyncsByUser(page, 10)
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

  getPageSyncDate(page: number) {
    this.isHidden = "";
    this.syncsService.getSyncsByUserDate(page, 10, this.from, this.until)
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

  getAllPageSyncDate(page: number) {
    this.isHidden = "";
    this.syncsService.getSyncsByDate(page, 10, this.from, this.until)
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

  getAllPageSync(page: number) {
    this.isHidden = "";
    this.syncsService.getAllSyncs(page, 10)
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

  getPageSyncByDistrict(page: number) {
    this.isHidden = "";
    this.syncsService.getSyncsByDistrict(page, 10, this.district_id)
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

  getPageSyncByDistrictDate(page: number) {
    this.isHidden = "";
    this.syncsService.getSyncsByDistrictDate(page, 10, this.district_id, this.from, this.until)
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

  getPageSyncByServerDate(page: number) {
    this.isHidden = "";
    this.syncsService.getSyncsByServerDate(page, 10, this.server_id, this.from, this.until)
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

  getPageSyncByServer(page: number) {
    this.isHidden = "";
    this.syncsService.getSyncsByServer(page, 10, this.server_id)
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
    //District all
    //No dates

    if (userValue.server == null || userValue.server == 'all') {
      this.disabled2 = false;

      if ((userValue.district == 'all' || userValue.district == null) && (userValue.start_from == null || userValue.start_from == "") && (userValue.start_until == null || userValue.start_until == "")) {
        this.disabled1 = true;
        if (this.ROLE_GDD || this.ROLE_ODMA || this.ROLE_ORMA) {
          this.serversService.getServersByUser()
            .subscribe(data => {
              this.allservers = data;
              this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,servers->name ASC", [this.allservers]);

            }, error => { }, () => { this.disabled1 = false; });
          this.date_filter = false;
          this.districts_filter = false;
          this.servers_filter = false;
          this.getPageSync(1);
        } else if (this.ROLE_SIS || this.ROLE_GMA || this.ROLE_OA) {
          this.serversService.getServers()
            .subscribe(data => {
              this.allservers = data;
              this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,servers->name ASC", [this.allservers]);

            }, error => { }, () => { this.disabled1 = false; });
          this.date_filter = false;
          this.districts_filter = false;
          this.servers_filter = false;
          this.getAllPageSync(1);
        }
        //District given
        //No dates
      } else if (userValue.district != 'all' && (userValue.start_from == null || userValue.start_from == "") && (userValue.start_until == null || userValue.start_until == "")) {
        this.disabled1 = true;
        this.serversService.getServersByDistrict(userValue.district)
          .subscribe(data => {
            this.allservers = data;
            this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,servers->name ASC", [this.allservers]);

          }, error => { }, () => { this.disabled1 = false; });
        this.date_filter = false;
        this.districts_filter = true;
        this.servers_filter = false;
        this.district_id = userValue.district;
        this.getPageSyncByDistrict(1);
        //District all
        //dates
      } else if ((userValue.district == 'all' || userValue.district == null) && (userValue.start_from != null && userValue.start_from != "") && (userValue.start_until != null && userValue.start_until != "")) {

        if (this.ROLE_GDD || this.ROLE_ODMA || this.ROLE_ORMA) {
          if (userValue.district == 'all') {
            this.disabled1 = true;
            this.serversService.getServersByUser()
              .subscribe(data => {
                this.allservers = data;
                this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,servers->name ASC", [this.allservers]);

              }, error => { }, () => { this.disabled1 = false; });
          }
          this.from = userValue.start_from;
          this.until = userValue.start_until;
          this.date_filter = true;
          this.districts_filter = false;
          this.servers_filter = false;
          this.getPageSyncDate(1);
        } else if (this.ROLE_SIS || this.ROLE_GMA || this.ROLE_OA) {
          if (userValue.district == 'all') {
            this.disabled1 = true;
            this.serversService.getServers()
              .subscribe(data => {
                this.allservers = data;
                this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,servers->name ASC", [this.allservers]);

              }, error => { }, () => { this.disabled1 = false; });
          }
          this.from = userValue.start_from;
          this.until = userValue.start_until;
          this.date_filter = true;
          this.districts_filter = false;
          this.servers_filter = false;
          this.getAllPageSyncDate(1);
        }
        //District given
        //dates
      } else if ((userValue.district != 'all' && userValue.district != null) && (userValue.start_from != null && userValue.start_from != "") && (userValue.start_until != null && userValue.start_until != "")) {
        this.disabled1 = true;
        this.serversService.getServersByDistrict(userValue.district)
          .subscribe(data => {
            this.allservers = data;
            this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,servers->name ASC", [this.allservers]);

          }, error => { }, () => { this.disabled1 = false; });
        this.from = userValue.start_from;
        this.until = userValue.start_until;
        this.districts_filter = true;
        this.date_filter = true;
        this.servers_filter = false;
        this.district_id = userValue.district;
        this.getPageSyncByDistrictDate(1);
      }
    } else {
      this.disabled2 = true;

      if ((userValue.start_from == null || userValue.start_from == "") && (userValue.start_until == null || userValue.start_until == "")) {
        this.date_filter = false;
        this.districts_filter = false;
        this.servers_filter = true;
        this.server_id = userValue.server;
        this.getPageSyncByServer(1);
      } else if ((userValue.start_from != null && userValue.start_from != "") && (userValue.start_until != null && userValue.start_until != "")) {
        this.from = userValue.start_from;
        this.until = userValue.start_until;
        this.districts_filter = false;
        this.date_filter = true;
        this.servers_filter = true;
        this.server_id = userValue.server;
        this.getPageSyncByServerDate(1);
      }

    }

  }


  printList() {
    this.isHidden = "";
    var userValue = this.form.value;




    if (userValue.server == null || userValue.server == 'all') {

      if ((userValue.district == 'all' || userValue.district == null) && (userValue.start_from != null && userValue.start_from != "") && (userValue.start_until != null && userValue.start_until != "")) {

        if (this.ROLE_GDD || this.ROLE_ODMA || this.ROLE_ORMA) {
        
          this.syncsService.getSyncsByUserDate(1, 1000000, this.from, this.until)
            .subscribe(data => {
              this.syncsreport = data.content;
            },
              error => {
                this.isHidden = "hide";

              },
              () => {
                this.isHidden = "hide";

                var user = JSON.parse(window.localStorage.getItem('user'));
                var doc = new jsPDF('landscape');
                var totalPagesExp = "{total_pages_count_string}";
                var columns = [
                  { title: "Servidor", dataKey: "serverreport" },
                  { title: "Horário de\nSincronização", dataKey: "synctime" },
                  { title: "Duração", dataKey: "duration" },
                  { title: "Nº itens na\nHora inicial", dataKey: "startitems" },
                  { title: "Nº itens na\nHora final", dataKey: "enditems" },
                  { title: "Encontrou\nerro?", dataKey: "syncerror" },
                  { title: "Sincronizado\npor", dataKey: "syncer" },
                  { title: "Observação", dataKey: "observations" }
                  
                ];
                var listSize = this.syncsreport.length;
                var datenow = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
      
                // HEADER
                doc.setFontSize(18);
                doc.text('Lista de Sincronizações efectuadas', 14, 22);
                doc.setFontSize(14);
                doc.text(listSize + ' sincronizações, efectuadas de ' + this.datepipe.transform(userValue.start_from, 'dd/MM/yyyy') + ' até ' + this.datepipe.transform(userValue.start_until, 'dd/MM/yyyy')+'.', 14, 45);
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
                    serverreport: { columnWidth: 45,fontSize:10 },
                    synctime: { columnWidth: 28,fontSize:10 },
                    duration: { columnWidth: 20,fontSize:10 },
                    startitems: { columnWidth: 33,fontSize:10 },
                    enditems: { columnWidth: 33,fontSize:10 },
                    syncerror: { columnWidth: 22,fontSize:10 },
                    syncer: { columnWidth: 28,fontSize:10 },
                    observations: { columnWidth: 61,fontSize:10 }
                    
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


        } else if (this.ROLE_SIS || this.ROLE_GMA || this.ROLE_OA) {


          this.syncsService.getSyncsByDate(1, 1000000, this.from, this.until)
            .subscribe(data => {
              this.syncsreport = data.content;
            },
              error => {
                this.isHidden = "hide";

              },
              () => {
                this.isHidden = "hide";

                var user = JSON.parse(window.localStorage.getItem('user'));
                var doc = new jsPDF('landscape');
                var totalPagesExp = "{total_pages_count_string}";
                var columns = [
                  { title: "Servidor", dataKey: "serverreport" },
                  { title: "Horário de\nSincronização", dataKey: "synctime" },
                  { title: "Duração", dataKey: "duration" },
                  { title: "Nº itens na\nHora inicial", dataKey: "startitems" },
                  { title: "Nº itens na\nHora final", dataKey: "enditems" },
                  { title: "Encontrou\nerro?", dataKey: "syncerror" },
                  { title: "Sincronizado\npor", dataKey: "syncer" },
                  { title: "Observação", dataKey: "observations" }
                  
                ];
                var listSize = this.syncsreport.length;
                var datenow = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
      
                // HEADER
                doc.setFontSize(18);
                doc.text('Lista de Sincronizações efectuadas', 14, 22);
                doc.setFontSize(14);
                doc.text(listSize + ' sincronizações, efectuadas de ' + this.datepipe.transform(userValue.start_from, 'dd/MM/yyyy') + ' até ' + this.datepipe.transform(userValue.start_until, 'dd/MM/yyyy')+'.', 14, 45);
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
                    serverreport: { columnWidth: 45,fontSize:10 },
                    synctime: { columnWidth: 28,fontSize:10 },
                    duration: { columnWidth: 26,fontSize:10 },
                    startitems: { columnWidth: 33,fontSize:10 },
                    enditems: { columnWidth: 33,fontSize:10 },
                    syncerror: { columnWidth: 22,fontSize:10 },
                    syncer: { columnWidth: 28,fontSize:10 },
                    observations: { columnWidth: 56,fontSize:10 }
                    
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
        //District given
        //dates
      }
    } else if ((userValue.district != 'all' && userValue.district != null) && (userValue.start_from != null && userValue.start_from != "") && (userValue.start_until != null && userValue.start_until != "")) {
        

        this.syncsService.getSyncsByDistrictDate(1, 1000000, this.district_id, this.from, this.until)
        .subscribe(data => {
          this.syncsreport = data.content;
        },
          error => {
            this.isHidden = "hide";

          },
          () => {
            this.isHidden = "hide";

            var user = JSON.parse(window.localStorage.getItem('user'));
            var doc = new jsPDF('landscape');
            var totalPagesExp = "{total_pages_count_string}";
            var columns = [
              { title: "Servidor", dataKey: "serverreport" },
              { title: "Horário de\nSincronização", dataKey: "synctime" },
              { title: "Duração", dataKey: "duration" },
              { title: "Nº itens na\nHora inicial", dataKey: "startitems" },
              { title: "Nº itens na\nHora final", dataKey: "enditems" },
              { title: "Encontrou\nerro?", dataKey: "syncerror" },
              { title: "Sincronizado\npor", dataKey: "syncer" },
              { title: "Observação", dataKey: "observations" }
              
            ];
            var listSize = this.syncsreport.length;
            var datenow = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
  
            // HEADER
            doc.setFontSize(18);
            doc.text('Lista de Sincronizações efectuadas', 14, 22);
            doc.setFontSize(14);
            doc.text(listSize + ' sincronizações, efectuadas de ' + this.datepipe.transform(userValue.start_from, 'dd/MM/yyyy') + ' até ' + this.datepipe.transform(userValue.start_until, 'dd/MM/yyyy')+'.', 14, 45);
            doc.setFontSize(11);
            doc.setTextColor(100);
            var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
            var text = doc.splitTextToSize('Sincronizações que ocorreram num determinado periodo e distrito.', pageWidth - 25, {});
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
                serverreport: { columnWidth: 45,fontSize:10 },
                synctime: { columnWidth: 28,fontSize:10 },
                duration: { columnWidth: 20,fontSize:10 },
                startitems: { columnWidth: 33,fontSize:10 },
                enditems: { columnWidth: 33,fontSize:10 },
                syncerror: { columnWidth: 22,fontSize:10 },
                syncer: { columnWidth: 28,fontSize:10 },
                observations: { columnWidth: 61,fontSize:10 }
                
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
    
  else {
       if ((userValue.start_from != null && userValue.start_from != "") && (userValue.start_until != null && userValue.start_until != "")) {
       
        this.syncsService.getSyncsByServerDate(1, 1000000, this.server_id, this.from, this.until)
        .subscribe(data => {
          this.syncsreport = data.content;
        },
          error => {
            this.isHidden = "hide";

          },
          () => {
            this.isHidden = "hide";

            var user = JSON.parse(window.localStorage.getItem('user'));
            var doc = new jsPDF('landscape');
            var totalPagesExp = "{total_pages_count_string}";
            var columns = [
              { title: "Servidor", dataKey: "serverreport" },
              { title: "Horário de\nSincronização", dataKey: "synctime" },
              { title: "Duração", dataKey: "duration" },
              { title: "Nº itens na\nHora inicial", dataKey: "startitems" },
              { title: "Nº itens na\nHora final", dataKey: "enditems" },
              { title: "Encontrou\nerro?", dataKey: "syncerror" },
              { title: "Sincronizado\npor", dataKey: "syncer" },
              { title: "Observação", dataKey: "observations" }
              
            ];
            var listSize = this.syncsreport.length;
            var datenow = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');
  
            // HEADER
            doc.setFontSize(18);
            doc.text('Lista de Sincronizações efectuadas', 14, 22);
            doc.setFontSize(14);
            doc.text(listSize + ' sincronizações, efectuadas de ' + this.datepipe.transform(userValue.start_from, 'dd/MM/yyyy') + ' até ' + this.datepipe.transform(userValue.start_until, 'dd/MM/yyyy')+'.', 14, 45);
            doc.setFontSize(11);
            doc.setTextColor(100);
            var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
            var text = doc.splitTextToSize('Sincronizações que ocorreram num determinado periodo e servidor.', pageWidth - 25, {});
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
                serverreport: { columnWidth: 45,fontSize:10 },
                    synctime: { columnWidth: 28,fontSize:10 },
                    duration: { columnWidth: 20,fontSize:10 },
                    startitems: { columnWidth: 33,fontSize:10 },
                    enditems: { columnWidth: 33,fontSize:10 },
                    syncerror: { columnWidth: 22,fontSize:10 },
                    syncer: { columnWidth: 28,fontSize:10 },
                    observations: { columnWidth: 61,fontSize:10 }
                
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

          });
    
      }

    }

  }

}
