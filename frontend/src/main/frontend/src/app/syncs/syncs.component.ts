import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSort, MatTableDataSource, MAT_DIALOG_DATA, PageEvent } from '@angular/material';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { SyncsService } from "./shared/syncs.service";
import { Router } from '@angular/router';
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
import {ExcelService} from '../resources/shared/excel.service';
import { ResourcesService } from "./../resources/shared/resources.service";

export class ReportObj{
  serverId:number;
  serverreport: String;
  Servidor:string;
  Distrito:string;
  Observacao:string;
}


@Component({
  selector: 'app-syncs',
  templateUrl: './syncs.component.html',
  styleUrls: ['./syncs.component.css']
})

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class SyncsComponent implements OnInit {
  public syncs;syncs1: Sync[] = [];
  public syncsreport: ReportObj[];
  public sync_id: number;
  public sync: Sync = new Sync();
  public isHidden: string;
  public allsyncs: Sync[] = [];
  public allsyncs2: Sync[] = [];
  public serverssyncinfo;

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
  public from; until; district_id; server_id; from2; until2;

  public user: Object[] = [];
  public nIntervId;

  public pageSize: number;
  public page: number;
  public maxDate=new Date();

  // MatPaginator Output
  public pageEvent: PageEvent;
  public displayedColumns: string[] = ['fullName','sync_time','duration','send_s','receive_s','send_e','receive_e','updated','actions'];
  @ViewChild(MatSort) sort: MatSort;

  public total; totali; number = 0;

  

  constructor(
    public excelService:ExcelService,
    public resourcesService: ResourcesService,
    public datepipe: DatePipe,
    public syncsService: SyncsService,
    public translate: TranslateService,
    public districtsService: DistrictsService,
    public formBuilder: FormBuilder,
    public serversService: ServersService,
    public router: Router,
    public dialog: MatDialog) {
    this.form = formBuilder.group({
      start_from: [],
      start_until: []
    });
  }
  public icon= 'chevron_left';
  public changeIcon(){
    if(this.icon=='chevron_left')
    this.icon='chevron_right';
    else
    this.icon='chevron_left';
  }
  ngOnInit() {
    this.total = 0;
    this.page=0;
    this.pageSize=10;
    this.isHidden = "";
    this.server_id = "";
    this.from = "";
    this.until = "";
    
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


    if(window.sessionStorage.getItem('sync-district')){
      this.district_id = +window.sessionStorage.getItem('sync-district');
    }else{
      this.district_id = "";;
    }


    if(window.sessionStorage.getItem('sync-server')){
      this.server_id = +window.sessionStorage.getItem('sync-server');
    }else{
      this.server_id = "";;
    }

    if(window.sessionStorage.getItem('sync-from')){
      this.from2 = new Date(window.sessionStorage.getItem('sync-from'));
      this.from = this.datepipe.transform(window.sessionStorage.getItem('sync-from'), 'yyyyMMdd');
    }else{
      this.from2 = "";
      this.from = "";
    }

    if(window.sessionStorage.getItem('sync-until')){
      this.until2 = new Date(window.sessionStorage.getItem('sync-until'));
      this.until = this.datepipe.transform(window.sessionStorage.getItem('sync-until'), 'yyyyMMdd');
    }else{
      this.until2 = "";
      this.until = "";
    }

    

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
        this.allserversfd = data.content;
        this.allservers = alasql("SELECT district->name AS district,ARRAY(_) AS servers FROM ? GROUP BY district->name ORDER BY district->name,name ASC", [this.allservers]);

      }, error => { }, () => { this.disabled1 = false; });

    this.getPage(1);
    clearInterval(this.nIntervId);

    this.nIntervId = setInterval(() => {

      if (this.router.url == "/syncs") {
        this.getPage(this.page);
      }

    }, 180000);
  }

  ngOnDestroy() {
    clearInterval(this.nIntervId);
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
this.search();
   }

  getPage(event) {
    
    this.isHidden = "";

    if(event!=null){
      if(event.pageIndex||event.pageSize){
      this.page=event.pageIndex;
      this.pageSize=event.pageSize;
      }
    }

    this.syncsService.findSyncs(this.page+1, this.pageSize, this.district_id, this.server_id, this.from, this.until, "createdBy.phoneNumber,updatedBy.phoneNumber,observation,syncId,startTime,startItemsToSend,startItemsToReceive,endTime,endItemsToSend,endItemsToReceive,observationHis,dateCreated,dateUpdated,syncError,createdBy.personName,updatedBy.personName,uid,serverFault,laptopFault,powerCut,canceled,district.name,server.name,server.type,syncErrorResolved,serverFaultResolved,laptopFaultResolved,powerCutResolved")
      .subscribe(data => {
        this.total = data.totalElements;
        this.syncs1 = data.content;
        this.syncs = new MatTableDataSource(this.syncs1);
        this.syncs.sort = this.sort;
      },
        error => {
          this.isHidden = "hide";
          this.total = 0;
          this.syncs = [];
          this.syncs1 = [];
        },
        () => {
          this.isHidden = "hide";
        }
      );
  }

  setSync(uuid) {
    this.sync = this.syncs1.find(item => item.uid == uuid);
    this.openDialog();
  }

  
  getOccurence(uid){
    var sync = this.syncs1.find(item => item.uid == uid);
    if((sync.syncError==true&&sync.syncErrorResolved==false)||(sync.serverFault==true&&sync.serverFaultResolved==false)||(sync.laptopFault==true&&sync.laptopFaultResolved==false)){
      return 'Occurence';
    }else{
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

  search() {

    var userValue = this.form.value;
    
    if (this.district_id == "all" || this.district_id == null || this.district_id == "") {
      this.district_id = "";
      window.sessionStorage.removeItem('sync-district');
    } else {
      window.sessionStorage.setItem('sync-district',this.district_id);
    }

    if ( this.server_id == "all" ||  this.server_id==null || this.server_id == "") {
      this.server_id = "";
      window.sessionStorage.removeItem('sync-server');
    } else {
      window.sessionStorage.setItem('sync-server',this.server_id);
    }

    if ((userValue.start_from != "" && userValue.start_from != null) && (userValue.start_until != "" && userValue.start_until != null)) {
      if (userValue.start_from <= userValue.start_until) {
        this.from = this.datepipe.transform(userValue.start_from, 'yyyyMMdd');
        this.until = this.datepipe.transform(userValue.start_until, 'yyyyMMdd');
        this.from2 = userValue.start_from;
        this.until2 = userValue.start_until;
        window.sessionStorage.setItem('sync-from',userValue.start_from);
        window.sessionStorage.setItem('sync-until',userValue.start_until);
      } else {
        this.from = "";
        this.until = "";
        window.sessionStorage.removeItem('sync-from');
        window.sessionStorage.removeItem('sync-until');
      }
    } else {
      this.from = "";
      this.until = "";
      window.sessionStorage.removeItem('sync-from');
      window.sessionStorage.removeItem('sync-until');
    }

    this.page=0;
    this.getPage(1);

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '800px',
      height: '600px',
      data: this.sync
    });
       
}

  search2() {

    var userValue = this.form.value;
    
    if ((userValue.start_from != "" && userValue.start_from != null) && (userValue.start_until != "" && userValue.start_until != null)) {
      if (userValue.start_from <= userValue.start_until) {
        this.from = this.datepipe.transform(userValue.start_from, 'yyyyMMdd');
        this.until = this.datepipe.transform(userValue.start_until, 'yyyyMMdd');
        this.from2 = userValue.start_from;
        this.until2 = userValue.start_until;
        window.sessionStorage.setItem('sync-from',userValue.start_from);
        window.sessionStorage.setItem('sync-until',userValue.start_until);
        this.page=0;
        this.getPage(1);
      } else {
        this.from = "";
        this.until = "";
        window.sessionStorage.removeItem('sync-from');
        window.sessionStorage.removeItem('sync-until');
      }
    } else if ((userValue.start_from == "" || userValue.start_from == null) && (userValue.start_until == "" || userValue.start_until == null)) {
      this.from = "";
      this.until = "";
      window.sessionStorage.removeItem('sync-from');
      window.sessionStorage.removeItem('sync-until');
      this.page=0;
      this.getPage(1);
    }
    else{
      this.from = "";
      this.until = "";
      window.sessionStorage.removeItem('sync-from');
      window.sessionStorage.removeItem('sync-until');
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

    alasql.fn.time = function (dateStr) {
      if(dateStr){
      var date = new Date(dateStr);
      return ("0" + date.getHours()).slice(-2)+":"+("0" + date.getMinutes()).slice(-2)
      ;
      }else{
        return "";
      }
    };
    

    this.syncsService.findSyncs(1, 1000, this.district_id, this.server_id, this.from, this.until, "observation,syncId,startTime,startItemsToSend,startItemsToReceive,endTime,endItemsToSend,endItemsToReceive,observationHis,dateCreated,dateUpdated,syncError,createdBy.personName,updatedBy.personName,uid,serverFault,laptopFault,powerCut,canceled,district.name,server.name,server.type,syncErrorResolved,serverFaultResolved,laptopFaultResolved,powerCutResolved")
      .subscribe(data => {
        this.syncsreport = data.content;
        this.syncsreport = alasql("SELECT CONCAT(server->name,'\n',district->name) AS serverreport,CONCAT(datetime(startTime),'\n',time(startTime),'-',time(endTime)) AS synctime, CONCAT(startItemsToSend,' por enviar\n',startItemsToReceive,' por receber') startitems,CASE WHEN endTime IS NOT NULL THEN CONCAT(endItemsToSend,' por enviar\n',endItemsToReceive,' por receber') ELSE '' END AS enditems, CONCAT(CASE WHEN syncError=true THEN 'Erro de Sync\n' ELSE '' END, CASE WHEN serverFault=true THEN 'Servidor avariou\n' ELSE '' END, CASE WHEN laptopFault=true THEN 'Laptop avariou\n' ELSE '' END, CASE WHEN powerCut=true THEN 'Corte de energia' ELSE '' END) AS syncerror , CONCAT(CASE WHEN syncErrorResolved=true THEN 'Erro foi resolvido\n' ELSE '' END, CASE WHEN serverFaultResolved=true THEN 'Servidor foi concertado\n' ELSE '' END, CASE WHEN laptopFaultResolved=true THEN 'Laptop foi concertado\n' ELSE '' END, CASE WHEN powerCutResolved=true THEN 'Energia restabelecida' ELSE '' END) AS syncerrorresolved ,createdBy->personName AS syncer,CONCAT('M&A: ',observation,'\nSIS: ',observationHis) AS observations FROM ?syncsreport ORDER BY district->name ASC,startTime DESC ", [this.syncsreport]);
        total = data.content.length;

        if (this.district_id == '' && this.server_id == '') {
          for (let s of this.allserversfd) {
            if (!this.syncsreport.find(item => item.serverreport == s.name + "\n" + s.districtName)) {
              let sync = new ReportObj();
              sync.serverreport = s.name + "\n" + s.districtName;
              sync.Observacao = "Não registou sincronização neste periodo.";
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
            { title: "Intervenção", dataKey: "syncerrorresolved" },
            { title: "Sincronização\niniciada por", dataKey: "syncer" },
            { title: "Observação", dataKey: "observations" }

          ];
          var listSize = total;
          var datenow = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm');

          // HEADER
          doc.setFontSize(18);
          doc.text('Lista de Sincronizações Registadas', 14, 22);
          doc.setFontSize(14);
          doc.text(listSize + ' sincronizações, registadas de ' + this.getDate(this.from) + ' até ' + this.getDate(this.until) + '.', 14, 45);
          doc.setFontSize(11);
          doc.setTextColor(100);
          var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
          var text = doc.splitTextToSize('Sincronizações OpenMRS registadas num determinado periodo.', pageWidth - 25, {});
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
              syncerrorresolved: { columnWidth: 35, fontSize: 8 },
              syncer: { columnWidth: 28, fontSize: 10 },
              observations: { columnWidth: 40, fontSize: 10 }

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
          doc.save('SCB_Lista de Sincronizações efectuadas_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm') + '.pdf');

        }
      );

  }

  printListExcel() {
    this.isHidden = "";

    alasql.fn.datetime = function (dateStr) {
      var date = new Date(dateStr);
      return ("0" + date.getDate()).slice(-2)+"-"+("0" + (date.getMonth()+1)).slice(-2)+"-"+date.getFullYear();
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
    
    this.syncsService.findSyncs(1, 1000, this.district_id, this.server_id, this.from, this.until, "observation,syncId,startTime,startItemsToSend,startItemsToReceive,endTime,endItemsToSend,endItemsToReceive,observationHis,dateCreated,dateUpdated,syncError,createdBy.personName,updatedBy.personName,uid,serverFault,laptopFault,powerCut,canceled,district.name,server.name,server.serverId,server.type,syncErrorResolved,serverFaultResolved,laptopFaultResolved,powerCutResolved")
      .subscribe(data => {
        this.syncsreport = data.content;
        this.syncsreport = alasql("SELECT district->name AS Distrito, server->name AS Servidor ,datetime(startTime) AS [Data de Sincronização],time(startTime) AS [Hora inicial],time(endTime) AS [Hora final], startItemsToSend AS [Itens por enviar no início], startItemsToReceive AS [Itens por receber no ínicio],endItemsToSend AS [Itens por enviar no fim], endItemsToReceive AS [Itens por receber no fim], CASE WHEN syncError=true THEN 'Sim' ELSE '' END AS [Erro ao Sincronizar?],CASE WHEN syncErrorResolved=true THEN 'Sim' ELSE '' END AS [Erro foi Resolvido?], CASE WHEN serverFault=true THEN 'Sim' ELSE '' END AS [Servidor avariou?],CASE WHEN serverFaultResolved=true THEN 'Sim' ELSE '' END AS [Servidor foi concertado?], CASE WHEN laptopFault=true THEN 'Sim' ELSE '' END AS [Laptop avariou?],CASE WHEN laptopFaultResolved=true THEN 'Sim' ELSE '' END AS [Laptop foi concertado?], CASE WHEN powerCut=true THEN 'Sim' ELSE '' END AS [Corte de energia?] ,CASE WHEN powerCutResolved=true THEN 'Sim' ELSE '' END AS [Energia restabelecida?] ,createdBy->personName AS [Iniciada por],observation AS [Observacao],observationHis AS [Observação SIS], server->serverId AS serverId FROM ?syncsreport ORDER BY district->name ASC,district->name ASC,startTime DESC ", [this.syncsreport]);

if(this.ROLE_SIS||this.ROLE_OA||this.ROLE_GMA){

        if (this.district_id == '' && this.server_id == '') {
          for (let s of this.allserversfd) {
            if (!this.syncsreport.find(item => item.Distrito == s.district.name && item.Servidor == s.name)) {
              let sync = new ReportObj();
              sync.serverId=s.serverId
              sync.Distrito = s.district.name;
              sync.Servidor = s.name;
              sync.Observacao = "Sem registo.";
              this.syncsreport.push(sync);
            }
          }
        }

        this.syncsreport = alasql("SELECT * FROM ?syncsreport ORDER BY Distrito ASC,Servidor ASC", [this.syncsreport]);

        this.resourcesService.findServersInfo()
        .subscribe(data => {
          this.serverssyncinfo = data;
        },
          error => {

            this.isHidden = "hide";
            this.syncsreport=[];

           },
          () => {

            var synced = alasql("SELECT [1] AS serverId,IFNULL([2],'') AS server_report FROM ?", [this.serverssyncinfo]);
            this.syncsreport = alasql("SELECT syncsreport.*, synced.server_report AS [Última Sincrinização] FROM ?syncsreport LEFT JOIN ?synced USING serverId ", [this.syncsreport, synced]);
            this.isHidden = "hide";
            this.excelService.exportAsExcelFile(this.syncsreport, 'SCB_Sincronizações efectuadas_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
          });

      }

      },error=>{
        this.isHidden = "hide";
        this.syncsreport=[];
      },
      ()=>{
       
      });
  }

  getDate(str: any){
    return str.charAt(6)+""+str.charAt(7)+"/"+str.charAt(4)+""+str.charAt(5)+"/"+str.charAt(0)+""+str.charAt(1)+str.charAt(2)+""+str.charAt(3);
  }

}

@Component({
  selector: 'syncs-info-dialog',
  templateUrl: 'syncs-info-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
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


