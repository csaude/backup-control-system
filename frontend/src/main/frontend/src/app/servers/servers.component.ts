import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSort, MatTableDataSource, MAT_DIALOG_DATA, PageEvent,MatSnackBar } from '@angular/material';
import { ServersService } from "./shared/servers.service";
import { Server } from "./shared/server";
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
import {ExcelService} from '../resources/shared/excel.service';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})

/** 
* @author Damasceno Lopes <damascenolopess@gmail.com>
*/
export class ServersComponent implements OnInit {
  public servers;servers1; serversreport: Server[] = [];
  public total: number = 0;
  public form: FormGroup;
  public server: Server = new Server();
  public isHidden; isHidden2m; isDisabledt: string;
  public name; district; type: string;

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
  public page: number;
  // MatPaginator Output
  public pageEvent: PageEvent;
  public displayedColumns: string[] = ['district','server','type','last_sync','updated','actions'];

  public types = [
    { name: 'CHILD' },
    { name: 'PARENT' }
  ]

  public user;

  public nameValueControl = new FormControl();
  public formCtrlSub: Subscription;

  @ViewChild(MatSort) sort: MatSort;
     
  constructor(
    public excelService:ExcelService,
    public datepipe: DatePipe,
    public serversService: ServersService,
    public resourcesService: ResourcesService,
    public translate: TranslateService,
    public formBuilder: FormBuilder,
    public syncsService: SyncsService,
    public districtsService: DistrictsService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog) {
    this.form = formBuilder.group({
      district: [],
      canceled: [],
      type: []
    });

    this.serversService.invokeEvent.subscribe(value => {
      if (value === 'someVal') {
        this.deleteServer();
      }
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
    if(window.sessionStorage.getItem('server-name')){
      this.name = window.sessionStorage.getItem('server-name');
    }else{
      this.name = "";
    }
    if(window.sessionStorage.getItem('server-district')){
      this.district = +window.sessionStorage.getItem('server-district');
    }else{
      this.district = "";;
    }
    this.type = "";
    
    if(window.sessionStorage.getItem('server-canceled')){
      this.canceled = true;
    }else{
      this.canceled = false;
    }
    

    this.page=0;
    this.pageSize=10;

    this.user = JSON.parse(window.sessionStorage.getItem('user'));
    this.ROLE_SIS = window.sessionStorage.getItem('ROLE_SIS');
    this.ROLE_OA = window.sessionStorage.getItem('ROLE_OA');
    this.ROLE_IT = window.sessionStorage.getItem('ROLE_IT');
    this.ROLE_GMA = window.sessionStorage.getItem('ROLE_GMA');
    this.ROLE_ODMA = window.sessionStorage.getItem('ROLE_ODMA');
    this.ROLE_ORMA = window.sessionStorage.getItem('ROLE_ORMA');
    this.ROLE_GDD = window.sessionStorage.getItem('ROLE_GDD');

    this.formCtrlSub = this.nameValueControl.valueChanges
      .debounceTime(200)
      .subscribe(newValue => {
        this.name = this.nameValueControl.value;
        this.search();
      });

    this.districtsService.findDistricts("","","","","parent.name,name,districtId")
      .subscribe(data => {
        this.alldistricts = data.content.filter(item => item.parent == null);;
      });
      
  }
  
  getPage(event) {

    if(event!=null){
      if(event.pageIndex||event.pageSize){
      this.page=event.pageIndex;
      this.pageSize=event.pageSize;
      }
    }
    this.isHidden = "";
    this.isDisabledt = "disabled";

    this.resourcesService.findServersInfo()
      .subscribe(data => {
        this.serverssyncinfo = data;
      },
        error => { },
        () => {

          this.serversService.findServers(this.page+1, this.pageSize, this.district, this.name.split(" ").join("SPACE"), this.canceled, this.type,"createdBy.phoneNumber,updatedBy.phoneNumber,canceledBy.personName,canceled,dateCanceled,canceledReason,observation,district.name,name,type,dateCreated,dateUpdated,createdBy.personName,updatedBy.personName,uid,serverId")
            .subscribe(data => {
              this.total = data.totalElements;
              var result = data.content;
              var synced = alasql("SELECT [0] AS sync_uuid,[1] AS serverId,[2] AS server_report,[3] AS duration,[4] AS end_items_to_send,[5] AS end_items_to_receive FROM ?", [this.serverssyncinfo]);
              this.servers1 = alasql("SELECT * FROM ?result LEFT JOIN ?synced USING serverId ", [result, synced]);
              this.servers = new MatTableDataSource(this.servers1);
              this.servers.sort = this.sort;

            },
              error => {
                this.isHidden = "hide";
                this.isDisabledt = "disabled";
                this.total = 0;
                this.servers = [];
                this.servers1 = [];
              },
              () => {
                this.isHidden = "hide";
                this.isDisabledt = "";
              }
            );
        });

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

  search() {
    var userValue = this.form.value;
    if (this.name) {
      window.sessionStorage.setItem('server-name',this.name);
    }
    else {
      this.name = "";
      window.sessionStorage.removeItem('server-name');
    }

    if (this.district == "all" || this.district == null || this.district == "") {
      this.district = "";
      window.sessionStorage.removeItem('server-district');
    } else {
      window.sessionStorage.setItem('server-district',this.district);
    }

    if (userValue.canceled) {
      this.canceled = userValue.canceled;
      window.sessionStorage.setItem('server-canceled','true');
    } else {
      this.canceled = false;
      window.sessionStorage.removeItem('server-canceled');
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
    this.page=0;
    this.getPage(1);
  }

  
  setServer(uuid) {
    this.server = this.servers1.find(item => item.uid == uuid);
    this.openDialog3();
  }

  setServerDelete(uuid) {
    this.server = this.servers1.find(item => item.uid == uuid);
    this.openDialog4();
  }


  deleteServer() {
    this.isHidden = "";
    this.isDisabledt = "disabled";
    this.serversService.deleteServer(this.server.uid)
      .subscribe(data => {
        if (data.text() == "Success") {
          this.search();
          this.openSnackBar("Servidor: "+this.server.name+", excluido com sucesso!", "OK");
          this.isDisabledt = "";
        } else {
          this.openSnackBar("Não é possivel excluir o Servidor!", "OK");
          this.isHidden = "hide";
          this.isDisabledt = "";
        }
      }
        ,
        error => {
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
                doc.text('Lista impressa em: ' + datenow + ', por: ' + user.person.othersNames + ' ' + user.person.surname + '.', 14, doc.autoTable.previous.finalY + 10);
                doc.setTextColor(0, 0, 200);
                doc.textWithLink('© Sistema de Controle de Backup', 14, doc.autoTable.previous.finalY + 15, { url: myGlobals.Production_URL });

                if (typeof doc.putTotalPages === 'function') {
                  doc.putTotalPages(totalPagesExp);
                }
                doc.save('SCB_Lista de Servidores de Sincronização_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm') + '.pdf');


              }
            );




        });


  }

  printListExcel() {
    this.isHidden = "";
    this.isDisabledt = "disabled";

    
    
    this.resourcesService.findServersInfo()
    .subscribe(data => {
      this.serverssyncinfo = data;
    },
      error => { },
      () => {

        this.serversService.findServers("", "", this.district, this.name, this.canceled, this.type,"serverId,district.name,name,type")
          .subscribe(data => {
            var result = data.content;
            var synced = alasql("SELECT [1] AS serverId,IFNULL([2],'') AS server_report,IFNULL([4],'') AS send,IFNULL([5],'') AS receive FROM ?", [this.serverssyncinfo]);
            this.serversreport = alasql("SELECT district->name AS Distrito,name AS Localhost, type AS Tipo, synced.server_report AS [Última Sincronização],synced.send AS [Itens por enviar no fim],synced.receive AS [Itens por receber no fim] FROM ?result LEFT JOIN ?synced USING serverId ", [result, synced]);
          },
            error => {
              this.isHidden = "hide";
              this.isDisabledt = "";
              this.serversreport = [];
            },
            () => {
              this.isHidden = "hide";
              this.isDisabledt = "";
              this.excelService.exportAsExcelFile(this.serversreport, 'SCB_Sync Localhosts_' + this.datepipe.transform(new Date(), 'dd-MM-yyyy HHmm'));
      });

    });
  }

  setSync(uuid) {
    this.isHidden = "";
    this.syncsService.findOneSyncByUuid(uuid,"createdBy.phoneNumber,updatedBy.phoneNumber,observation,syncId,startTime,startItemsToSend,startItemsToReceive,endTime,endItemsToSend,endItemsToReceive,observationHis,dateCreated,dateUpdated,syncError,createdBy.personName,updatedBy.personName,uid,serverFault,laptopFault,powerCut,canceled,district.name,server.name,server.type,syncErrorResolved,serverFaultResolved,laptopFaultResolved,powerCutResolved")
      .subscribe(
        sync => {
          this.sync = sync;
        }, error => { }, () => { this.isHidden = "hide";this.openDialog2(); });
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
      data: this.server
    });
       
  }
  
  
  openDialog4(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog4, {
      width: '800px',
      height: '250px',
      data: this.server
    });

  }

  
  
}

@Component({
  selector: 'servers-delete-dialog',
  templateUrl: 'servers-delete-dialog.html',
})
export class DialogOverviewExampleDialog4 {

  
  constructor(
    public serversService: ServersService,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog4>,
    @Inject(MAT_DIALOG_DATA) public data: Server) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDeleteClick(): void {
    this.serversService.callMethodOfSecondComponent();
    this.dialogRef.close();
  }

}

@Component({
  selector: 'servers-info-dialog',
  templateUrl: 'servers-info-dialog.html',
})
export class DialogOverviewExampleDialog3 {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog3>,
    @Inject(MAT_DIALOG_DATA) public data: Server) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'servers-sync-dialog',
  templateUrl: 'servers-sync-dialog.html',
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